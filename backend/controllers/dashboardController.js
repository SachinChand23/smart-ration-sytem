const db = require('../config/db');

// Helper to promisify db.query
const query = (sql, params = []) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) reject(err);
    else resolve(results);
  });
});

// ADMIN DASHBOARD
exports.getAdminDashboard = async (req, res) => {
  try {
    const [userRows] = await query("SELECT COUNT(*) as count FROM users");
    const [shopRows] = await query("SELECT COUNT(*) as count FROM shops");
    const [stockRows] = await query("SELECT COALESCE(SUM(rice + wheat), 0) as totalStock, COALESCE(SUM(rice), 0) as totalRice, COALESCE(SUM(wheat), 0) as totalWheat FROM stock");
    const [txRows] = await query("SELECT COUNT(*) as count FROM transactions");
    const [distRows] = await query("SELECT COALESCE(SUM(rice + wheat), 0) as distributed FROM transactions");

    // Low stock alerts (shops where rice < 100 OR wheat < 100)
    const lowStockShops = await query("SELECT s.shop_id, sh.name FROM stock s LEFT JOIN shops sh ON s.shop_id = sh.id WHERE s.rice < 100 OR s.wheat < 100");

    // Recent distributions
    const recentTx = await query("SELECT t.id, u.name as beneficiaryName, u.aadhaar, sh.name as shopName, t.date, t.rice, t.wheat FROM transactions t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN shops sh ON t.shop_id = sh.id ORDER BY t.date DESC LIMIT 10");

    // Breakdown by category
    const [aayCount] = await query("SELECT COUNT(*) as count FROM users WHERE role = 'user' AND rationCardType = 'AAY'");
    const [phhCount] = await query("SELECT COUNT(*) as count FROM users WHERE role = 'user' AND rationCardType = 'PHH'");
    const [nphhCount] = await query("SELECT COUNT(*) as count FROM users WHERE role = 'user' AND rationCardType = 'NPHH'");

    res.json({
      beneficiaryCount: userRows.count,
      shopCount: shopRows.count,
      totalStock: stockRows.totalStock,
      totalRice: stockRows.totalRice,
      totalWheat: stockRows.totalWheat,
      totalTransactions: txRows.count,
      distributedStock: distRows.distributed,
      lowStockAlerts: lowStockShops.length,
      recentDistributions: recentTx,
      categoryStats: { aay: aayCount.count, phh: phhCount.count, nphh: nphhCount.count }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL BENEFICIARIES
exports.getAllBeneficiaries = async (req, res) => {
  try {
    const users = await query("SELECT id, name, aadhaar, ration_card_number, rationCardType, family_members, mobile_number, area, shop_id, is_verified FROM users WHERE role = 'user'");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER (ADMIN)
exports.adminUpdateUser = async (req, res) => {
  const { id } = req.params;
  const { name, aadhaar, ration_card_number, rationCardType, family_members, mobile_number, area, shop_id } = req.body;
  try {
    await query("UPDATE users SET name=?, aadhaar=?, ration_card_number=?, rationCardType=?, family_members=?, mobile_number=?, area=?, shop_id=? WHERE id=? AND role='user'",
      [name, aadhaar, ration_card_number, rationCardType, family_members, mobile_number, area, shop_id, id]);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL SHOPS
exports.getAllShops = async (req, res) => {
  try {
    const shops = await query("SELECT s.*, st.rice, st.wheat FROM shops s LEFT JOIN stock st ON s.id = st.shop_id");
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD SHOP
exports.addShop = async (req, res) => {
  const { name, location } = req.body;
  try {
    const result = await query("INSERT INTO shops (name, location) VALUES (?, ?)", [name, location]);
    await query("INSERT INTO stock (shop_id, rice, wheat) VALUES (?, 0, 0)", [result.insertId]);
    res.json({ message: "Shop added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STOCK
exports.updateStock = async (req, res) => {
  const { shop_id, rice, wheat } = req.body;
  try {
    await query("UPDATE stock SET rice = ?, wheat = ? WHERE shop_id = ?", [rice, wheat, shop_id]);
    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL STOCK
exports.getAllStock = async (req, res) => {
  try {
    const stock = await query("SELECT st.*, sh.name as shopName, sh.location FROM stock st LEFT JOIN shops sh ON st.shop_id = sh.id");
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL TRANSACTIONS (Reports)
exports.getAllTransactions = async (req, res) => {
  try {
    const txs = await query("SELECT t.*, u.name as beneficiaryName, u.aadhaar, sh.name as shopName FROM transactions t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN shops sh ON t.shop_id = sh.id ORDER BY t.date DESC");
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SHOPKEEPER DASHBOARD
exports.getShopkeeperDashboard = async (req, res) => {
  const shop_id = req.params.shop_id || 1;
  try {
    const stockRows = await query("SELECT rice, wheat FROM stock WHERE shop_id = ?", [shop_id]);
    const currentStock = stockRows[0] || { rice: 0, wheat: 0 };
    const dailyTx = await query("SELECT t.*, u.name as userName FROM transactions t LEFT JOIN users u ON t.user_id = u.id WHERE t.shop_id = ? AND DATE(t.date) = CURDATE()", [shop_id]);
    res.json({ currentStock, dailyTransactions: dailyTx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// USER DASHBOARD
exports.getUserDashboard = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const userRows = await query("SELECT u.*, s.name as shopName FROM users u LEFT JOIN shops s ON u.shop_id = s.id WHERE u.id = ?", [user_id]);
    const user = userRows[0];
    if (!user) return res.status(404).send("User not found");

    let entitlement = { rice: 0, wheat: 0 };
    if (user.rationCardType === 'AAY') {
      entitlement = { rice: 35, wheat: 0 };
    } else if (user.rationCardType === 'PHH') {
      entitlement = { rice: 5 * (user.family_members || 1), wheat: 2 * (user.family_members || 1) };
    } else if (user.rationCardType === 'NPHH') {
      entitlement = { rice: 0, wheat: 0 };
    }

    const txHistory = await query("SELECT t.*, s.name as shopName FROM transactions t LEFT JOIN shops s ON t.shop_id = s.id WHERE user_id = ? ORDER BY date DESC", [user_id]);

    res.json({
      user: { name: user.name, aadhaar: user.aadhaar, ration_card_number: user.ration_card_number, rationCardType: user.rationCardType, family_members: user.family_members, area: user.area, shopName: user.shopName },
      entitlement,
      transactionHistory: txHistory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH USER BY AADHAAR OR RATION CARD
exports.searchUserByAadhaar = async (req, res) => {
  const { aadhaar, ration_card } = req.body;
  try {
    let rows;
    if (aadhaar) {
      rows = await query("SELECT id, name, aadhaar, ration_card_number, rationCardType, family_members, area, shop_id FROM users WHERE aadhaar = ? AND role = 'user'", [aadhaar]);
    } else if (ration_card) {
      rows = await query("SELECT id, name, aadhaar, ration_card_number, rationCardType, family_members, area, shop_id FROM users WHERE ration_card_number = ? AND role = 'user'", [ration_card]);
    } else {
      return res.status(400).send("Provide aadhaar or ration_card");
    }
    if (!rows[0]) return res.status(404).send("User not found");
    const user = rows[0];

    // Check if user already received ration this month
    const monthlyCheck = await query(
      `SELECT SUM(rice) as rice_collected, SUM(wheat) as wheat_collected, COUNT(*) as times
       FROM transactions
       WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())`,
      [user.id]
    );
    const monthly = monthlyCheck[0];
    user.monthly_collected = monthly.times > 0;
    user.rice_collected = monthly.rice_collected || 0;
    user.wheat_collected = monthly.wheat_collected || 0;

    // Calculate entitlement based on rationCardType
    let entitlement = { rice: 0, wheat: 0 };
    if (user.rationCardType === 'AAY') {
      entitlement = { rice: 35, wheat: 0 };
    } else if (user.rationCardType === 'PHH') {
      entitlement = { rice: 5 * (user.family_members || 1), wheat: 2 * (user.family_members || 1) };
    } else if (user.rationCardType === 'NPHH') {
      entitlement = { rice: 2 * (user.family_members || 1), wheat: 1 * (user.family_members || 1) };
    }
    user.entitlement = entitlement;
    user.rice_remaining = Math.max(0, entitlement.rice - user.rice_collected);
    user.wheat_remaining = Math.max(0, entitlement.wheat - user.wheat_collected);

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DISTRIBUTE RATION
exports.distributeRation = async (req, res) => {
  const { user_id, shop_id, rice, wheat } = req.body;
  try {
    // 1. Check if user already received full ration this month
    const [monthCheck] = await query(
      `SELECT SUM(rice) as rice_got, SUM(wheat) as wheat_got FROM transactions
       WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())`,
      [user_id]
    );

    // 2. Get user entitlement
    const userRows = await query("SELECT rationCardType, family_members FROM users WHERE id = ?", [user_id]);
    if (!userRows[0]) return res.status(404).json({ error: "User not found" });
    const { rationCardType, family_members } = userRows[0];
    let maxRice = 0, maxWheat = 0;
    if (rationCardType === 'AAY')       { maxRice = 35; maxWheat = 0; }
    else if (rationCardType === 'PHH')  { maxRice = 5 * (family_members || 1); maxWheat = 2 * (family_members || 1); }
    else if (rationCardType === 'NPHH') { maxRice = 2 * (family_members || 1); maxWheat = 1 * (family_members || 1); }

    const riceGot = monthCheck.rice_got || 0;
    const wheatGot = monthCheck.wheat_got || 0;
    const riceAllowed = Math.max(0, maxRice - riceGot);
    const wheatAllowed = Math.max(0, maxWheat - wheatGot);

    if (riceAllowed === 0 && wheatAllowed === 0) {
      return res.status(400).json({ error: `This beneficiary has already received their full monthly entitlement (${maxRice} kg rice, ${maxWheat} kg wheat).` });
    }

    // Cap requested amounts to what's still allowed
    const riceToGive = Math.min(Number(rice) || 0, riceAllowed);
    const wheatToGive = Math.min(Number(wheat) || 0, wheatAllowed);

    if (riceToGive === 0 && wheatToGive === 0) {
      return res.status(400).json({ error: "Nothing to distribute. Beneficiary's remaining entitlement is 0 for the selected items." });
    }

    // 3. Check shop has sufficient stock
    const stockRows = await query("SELECT rice, wheat FROM stock WHERE shop_id = ?", [shop_id]);
    const stock = stockRows[0] || { rice: 0, wheat: 0 };
    if (riceToGive > stock.rice) {
      return res.status(400).json({ error: `Insufficient rice in stock. Available: ${stock.rice} kg, Requested: ${riceToGive} kg.` });
    }
    if (wheatToGive > stock.wheat) {
      return res.status(400).json({ error: `Insufficient wheat in stock. Available: ${stock.wheat} kg, Requested: ${wheatToGive} kg.` });
    }

    // 4. Record transaction and deduct stock
    await query("INSERT INTO transactions (user_id, shop_id, rice, wheat) VALUES (?, ?, ?, ?)", [user_id, shop_id, riceToGive, wheatToGive]);
    await query("UPDATE stock SET rice = rice - ?, wheat = wheat - ? WHERE shop_id = ?", [riceToGive, wheatToGive, shop_id]);

    res.json({
      message: `Ration distributed successfully ✅`,
      distributed: { rice: riceToGive, wheat: wheatToGive }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

