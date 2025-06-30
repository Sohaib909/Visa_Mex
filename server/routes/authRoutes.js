const express = require('express');
const router = express.Router();
const passport = require('passport');
const { auth } = require('../middleware/auth');
const {
  register,
  verifyEmail,
  resendVerificationCode,
  checkRegistrationStatus,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  googleTokenVerify
} = require('../controllers/authController');

 
router.post('/register', register);

 
router.post('/verify-email', verifyEmail);

 
router.post('/resend-verification', resendVerificationCode);

 
router.get('/registration-status/:email', checkRegistrationStatus);

 
router.post('/login', login);

 
router.post('/forgot-password', forgotPassword);

 
router.post('/reset-password', resetPassword);

 
router.post('/google/verify', googleTokenVerify);

 
router.post('/facebook/verify', googleTokenVerify); // We'll create a separate function later

 
router.get('/profile', auth, getProfile);

 
router.put('/profile', auth, updateProfile);

 
router.put('/change-password', auth, changePassword);

 
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

 
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      // Generate JWT for the authenticated user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      // Redirect to frontend with token and user data
      const userData = encodeURIComponent(JSON.stringify(req.user.toAuthJSON()));
      res.redirect(`${process.env.CLIENT_URL}/login/callback?token=${token}&user=${userData}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_callback_failed`);
    }
  }
);

 
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));

 
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      // Generate JWT for the authenticated user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      // Redirect to frontend with token and user data
      const userData = encodeURIComponent(JSON.stringify(req.user.toAuthJSON()));
      res.redirect(`${process.env.CLIENT_URL}/login/callback?token=${token}&user=${userData}`);
    } catch (error) {
      console.error('Facebook OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_callback_failed`);
    }
  }
);

module.exports = router; 