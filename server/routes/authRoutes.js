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

// Logout endpoint - clears both session and JWT
router.post('/logout', (req, res) => {
  try {
    // Check if user is authenticated via session (Passport)
    const hasSession = req.isAuthenticated && req.isAuthenticated();
    
    if (hasSession) {
      // Only call passport logout if there's an active session
      req.logout((err) => {
        if (err) {
          console.error('Passport logout error:', err);
        }
      });
      
      // Destroy session if it exists
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error('Session destruction error:', err);
          }
        });
      }
      
      // Clear session cookie
      res.clearCookie('connect.sid'); // default session cookie name
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully',
      clearedSession: hasSession
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Authentication check endpoint - checks both session and JWT
router.get('/me', async (req, res) => {
  try {
    let user = null;
    let authMethod = null;

    // Check 1: Session-based authentication (from Passport) - with error handling
    try {
      if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        user = req.user;
        authMethod = 'session';
      }
    } catch (sessionError) {
      console.log('Session check failed:', sessionError.message);
      // Continue to JWT check
    }
    
    // Check 2: JWT-based authentication (fallback if no session)
    if (!user) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const jwt = require('jsonwebtoken');
          const User = require('../models/User');
          
          const token = authHeader.substring(7);
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const jwtUser = await User.findById(decoded.id).select('-password');
          
          if (jwtUser && jwtUser.isActive) {
            user = jwtUser;
            authMethod = 'jwt';
          }
        } catch (jwtError) {
          console.log('JWT check failed:', jwtError.message);
          // Continue without user
        }
      }
    }

    if (user) {
      // Generate new JWT if authenticated via session only
      if (authMethod === 'session') {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '24h'
        });
        
        return res.json({
          success: true,
          user: user.toAuthJSON ? user.toAuthJSON() : user,
          token: token,
          authMethod: authMethod
        });
      }
      
      return res.json({
        success: true,
        user: user.toAuthJSON ? user.toAuthJSON() : user,
        authMethod: authMethod
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication check failed'
    });
  }
});

module.exports = router; 