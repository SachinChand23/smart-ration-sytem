const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper to promisify db.query
const query = (sql, params = []) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) reject(err);
    else resolve(results);
  });
});

// SEND SHOPKEEPER OTP
exports.sendShopkeeperOTP = async (req, res) => {
  const { shopkeeper_id, aadhaar } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).send("Valid 12-digit Aadhaar is required to send OTP.");
  }

  try {
    // 1. Verify shopkeeper exists in authorized registry
    const rows = await query(
      "SELECT phone_number FROM shopkeeper_auth WHERE shopkeeper_id = ? AND aadhaar = ?", 
      [shopkeeper_id, aadhaar]
    );

    if (rows.length === 0) {
      return res.status(404).send("No authorized record found for this Shopkeeper ID and Aadhaar combination.");
    }

    const phoneNumber = rows[0].phone_number;

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 3. Store in otp_verifications (Upsert)
    await db.promise().query(
      "INSERT INTO otp_verifications (aadhaar, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?",
      [aadhaar, otp, expiresAt, otp, expiresAt]
    );

    // 4. "Send" OTP (Simulated)
    console.log(`[OTP SERVICE] Sending OTP ${otp} to Shopkeeper at ${phoneNumber}`);
    
    const maskedPhone = phoneNumber.slice(0, 2) + "******" + phoneNumber.slice(-2);
    
    res.json({ 
      message: `OTP sent successfully to your registered mobile number ${maskedPhone}`,
      dev_otp: otp 
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending OTP: " + err.message);
  }
};

// REGISTER SHOPKEEPER
exports.registerShopkeeper = async (req, res) => {
  const { shopkeeper_id, aadhaar, password, shop_id, otp } = req.body;

  if (!otp) return res.status(400).send("OTP is required.");
  if (!shopkeeper_id) return res.status(400).send("Shopkeeper ID is required.");
  if (!aadhaar || aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
    return res.status(400).send("Aadhaar must be exactly 12 digits.");
  }
  if (!password || password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters.");
  }

  try {
    // 1. VERIFY OTP
    const [otpRecord] = await db.promise().query(
      "SELECT * FROM otp_verifications WHERE aadhaar = ? AND otp = ? AND expires_at > NOW()",
      [aadhaar, otp]
    );

    if (otpRecord.length === 0) {
      return res.status(400).send("Invalid or expired OTP. Please try again.");
    }

    // 2. VERIFICATION: Check against shopkeeper_auth table
    const checkRows = await query("SELECT * FROM shopkeeper_auth WHERE shopkeeper_id = ? AND aadhaar = ?", [shopkeeper_id, aadhaar]);
    
    if (checkRows.length === 0) {
      return res.status(400).send("Verification Failed: Shopkeeper ID and Aadhaar do not match our authorized records.");
    }

    const authorizedData = checkRows[0];

    // If shop_id provided, verify the shop exists
    let assignedShopId = shop_id;
    if (shop_id) {
      const shopRows = await query("SELECT id FROM shops WHERE id = ?", [shop_id]);
      if (shopRows.length === 0) {
        return res.status(400).send("Shop not found. Please enter a valid Shop ID.");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `INSERT INTO users (name, aadhaar, password, role, shop_id) VALUES (?, ?, ?, 'shopkeeper', ?)`;

    db.query(insertQuery, [authorizedData.name, aadhaar, hashedPassword, assignedShopId || null], async (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send("Aadhaar is already registered.");
        }
        return res.status(500).send("Registration failed: " + err.message);
      }

      // 3. Clear OTP
      await db.promise().query("DELETE FROM otp_verifications WHERE aadhaar = ?", [aadhaar]);

      res.send("Shopkeeper Registered Successfully ✅");
    });
  } catch (err) {
    res.status(500).send("Registration failed: " + err.message);
  }
};

// VERIFY OTP ONLY
exports.verifyOTPOnly = async (req, res) => {
  const { aadhaar, otp } = req.body;

  if (!aadhaar || !otp) {
    return res.status(400).send("Aadhaar and OTP are required.");
  }

  try {
    const [otpRecord] = await db.promise().query(
      "SELECT * FROM otp_verifications WHERE aadhaar = ? AND otp = ? AND expires_at > NOW()",
      [aadhaar, otp]
    );

    if (otpRecord.length === 0) {
      return res.status(400).send("Invalid or expired OTP.");
    }

    res.send("Shopkeeper Verified Successfully ✅");
  } catch (err) {
    res.status(500).send("Error verifying OTP: " + err.message);
  }
};

// SHOPKEEPER LOGIN
exports.loginShopkeeper = async (req, res) => {
  const { aadhaar, password } = req.body;

  try {
    const rows = await query("SELECT * FROM users WHERE aadhaar = ? AND role = 'shopkeeper'", [aadhaar]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Shopkeeper not found. Make sure you are registered as a shopkeeper." });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, aadhaar: user.aadhaar, shop_id: user.shop_id },
      "secret123",
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        aadhaar: user.aadhaar,
        shop_id: user.shop_id
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// GET AVAILABLE SHOPS (for shopkeeper registration)
exports.getAvailableShops = async (req, res) => {
  try {
    const shops = await query("SELECT id, name, location FROM shops");
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
