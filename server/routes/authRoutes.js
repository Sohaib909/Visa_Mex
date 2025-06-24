const express = require('express');
const router = express.Router();
const passport = require('passport');
const { auth } = require('../middleware/auth');
const {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  googleTokenVerify
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/verify-email
// @desc    Verify email with code
// @access  Public
router.post('/verify-email', verifyEmail);

// @route   POST /api/auth/resend-verification
// @desc    Resend verification code
// @access  Public
router.post('/resend-verification', resendVerificationCode);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password - send reset code
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password with verification code
// @access  Public
router.post('/reset-password', resetPassword);

// @route   POST /api/auth/google/verify
// @desc    Verify Google OAuth token
// @access  Public
router.post('/google/verify', googleTokenVerify);

// @route   POST /api/auth/facebook/verify
// @desc    Verify Facebook OAuth token
// @access  Public
router.post('/facebook/verify', googleTokenVerify); // We'll create a separate function later

// Protected Routes
// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, changePassword);

// Google OAuth Routes
// @route   GET /api/auth/google
// @desc    Authenticate with Google OAuth
// @access  Public
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      // Generate JWT for the authenticated user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
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

// Facebook OAuth Routes
// @route   GET /api/auth/facebook
// @desc    Authenticate with Facebook OAuth
// @access  Public
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));

// @route   GET /api/auth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      // Generate JWT for the authenticated user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
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