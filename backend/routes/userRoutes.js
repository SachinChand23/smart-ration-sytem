const express = require('express');
const router = express.Router();

const { registerUser, loginUser, resetPassword, verifyUser, unverifyUser, sendUserOTP, verifyOTPOnly } = require('../controllers/userController');

router.post('/send-otp', sendUserOTP);
router.post('/verify-otp', verifyOTPOnly);
router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/reset-password', resetPassword);

// Admin verification routes
router.put('/verify/:id', verifyUser);
router.put('/unverify/:id', unverifyUser);

module.exports = router;