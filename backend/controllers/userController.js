const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SEND USER OTP
exports.sendUserOTP = async (req, res) => {
  const { aadhaar, ration_card_number } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).send("Valid 12-digit Aadhaar is required to send OTP.");
  }

  try {
    // 1. Verify user exists in ration_cards registry
    const [officialRecord] = await db.promise().query(
      "SELECT phone_number FROM ration_cards WHERE aadhaar = ? AND ration_card_number = ?", 
      [aadhaar, ration_card_number]
    );

    if (officialRecord.length === 0) {
      return res.status(404).send("No official record found for this Aadhaar and Ration Card combination.");
    }

    const phoneNumber = officialRecord[0].phone_number;

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 3. Store in otp_verifications (Upsert)
    await db.promise().query(
      "INSERT INTO otp_verifications (aadhaar, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?",
      [aadhaar, otp, expiresAt, otp, expiresAt]
    );

    // 4. "Send" OTP (Simulated via console and response for development)
    console.log(`[OTP SERVICE] Sending OTP ${otp} to phone number ${phoneNumber} for Aadhaar ${aadhaar}`);
    
    // Mask phone number for security
    const maskedPhone = phoneNumber.slice(0, 2) + "******" + phoneNumber.slice(-2);
    
    res.json({ 
      message: `OTP sent successfully to your registered mobile number ${maskedPhone}`,
      dev_otp: otp // Returning OTP for easy testing since we don't have a real SMS gateway
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending OTP: " + err.message);
  }
};

// REGISTER
exports.registerUser = async (req, res) => {
  const { aadhaar, ration_card_number, password, mobile_number, area, shop_id, otp } = req.body;

  // Validate OTP
  if (!otp) return res.status(400).send("OTP is required.");

  // Validate Aadhaar (must be 12 digits)
  if (!aadhaar || aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
    return res.status(400).send("Aadhaar must be exactly 12 digits.");
  }

  // Validate Password (min 6 chars)
  if (!password || password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters.");
  }

  // Validate Mobile Number (must be 10 digits and numeric, start with 6-9)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!mobile_number || !phoneRegex.test(mobile_number)) {
    return res.status(400).send("Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
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

    // Still checking if the Aadhaar/Ration Card exists in registry to fetch official data
    const [officialResults] = await db.promise().query(
      "SELECT * FROM ration_cards WHERE ration_card_number = ? AND aadhaar = ?", 
      [ration_card_number, aadhaar]
    );
    
    if (officialResults.length === 0) {
      return res.status(400).send("Verification Failed: Ration Card Number and Aadhaar do not match our official records.");
    }

    const officialRecord = officialResults[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (name, aadhaar, password, role, ration_card_number, rationCardType, family_members, mobile_number, area, shop_id, is_verified)
                   VALUES (?, ?, ?, 'user', ?, ?, ?, ?, ?, ?, true)`;

    // Automatically fetch everything from officialRecord
    const finalName = officialRecord.name;
    const finalType = officialRecord.rationCardType;
    const finalFamily = officialRecord.family_members;
    const finalMobile = officialRecord.phone_number;
    const finalArea = officialRecord.area;
    const finalShop = officialRecord.assigned_shop_id;

    db.query(query, [finalName, aadhaar, hashedPassword, ration_card_number, finalType, finalFamily, finalMobile, finalArea, finalShop], async (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          if (err.sqlMessage && err.sqlMessage.includes('ration_card_number')) {
            return res.status(400).send("Ration Card Number is already registered.");
          }
          if (err.sqlMessage && err.sqlMessage.includes('aadhaar')) {
            return res.status(400).send("Aadhaar is already registered.");
          }
          if (err.sqlMessage && err.sqlMessage.includes('mobile_number')) {
            return res.status(400).send("This mobile number is already registered.");
          }
          return res.status(400).send("Duplicate entry detected.");
        }
        return res.status(500).send(err);
      }
      
      // 3. Clear OTP after successful registration
      await db.promise().query("DELETE FROM otp_verifications WHERE aadhaar = ?", [aadhaar]);
      
      res.send("User Registered Successfully ✅");
    });
  } catch (err) {
    res.status(500).send(err);
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

    res.send("User Verified Successfully ✅");
  } catch (err) {
    res.status(500).send("Error verifying OTP: " + err.message);
  }
};



// LOGIN
exports.loginUser = (req, res) => {
  const { aadhaar, password } = req.body;

  const query = `SELECT * FROM users WHERE aadhaar = ?`;

  db.query(query, [aadhaar], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, aadhaar: user.aadhaar, rationCardType: user.rationCardType, shop_id: user.shop_id, area: user.area }, "secret123", {
      expiresIn: "1h"
    });

    res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, role: user.role, aadhaar: user.aadhaar, shop_id: user.shop_id, area: user.area } });
  });
};


// GET USERS
exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// VERIFY USER (ADMIN)
exports.verifyUser = (req, res) => {
  const { id } = req.params;
  db.query("UPDATE users SET is_verified = true WHERE id = ? AND role = 'user'", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send("User not found");
    res.send("User verified successfully ✅");
  });
};

// REJECT / UNVERIFY USER (ADMIN)
exports.unverifyUser = (req, res) => {
  const { id } = req.params;
  db.query("UPDATE users SET is_verified = false WHERE id = ? AND role = 'user'", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send("User not found");
    res.send("User unverified.");
  });
};


// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { aadhaar, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).send("Password must be at least 6 characters.");
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `UPDATE users SET password = ? WHERE aadhaar = ?`;
    
    db.query(query, [hashedPassword, aadhaar], (err, result) => {
      if (err) return res.status(500).send(err);
      
      if (result.affectedRows === 0) {
        return res.status(404).send("User with this Aadhaar not found");
      }
      res.send("Password reset successfully");
    });
  } catch (err) {
    res.status(500).send(err);
  }
};