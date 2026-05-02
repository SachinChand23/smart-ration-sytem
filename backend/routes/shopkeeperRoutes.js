const express = require('express');
const router = express.Router();

const {
  registerShopkeeper,
  loginShopkeeper,
  getAvailableShops,
  sendShopkeeperOTP,
  verifyOTPOnly
} = require('../controllers/shopkeeperController');

router.post('/send-otp', sendShopkeeperOTP);
router.post('/verify-otp', verifyOTPOnly);
router.post('/register', registerShopkeeper);
router.post('/login', loginShopkeeper);
router.get('/shops', getAvailableShops);

module.exports = router;
