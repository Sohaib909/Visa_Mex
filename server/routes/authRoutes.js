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
    console.log('🚪 Logout request received');
    
    // Check if user is authenticated via session (Passport)
    const hasSession = req.isAuthenticated && req.isAuthenticated();
    console.log('📋 Session check:', hasSession ? 'Active session found' : 'No active session');
    
    if (hasSession) {
      console.log('🧹 Clearing Passport session...');
      
      // First destroy the session to avoid Passport regeneration error
      if (req.session) {
        try {
          req.session.destroy((err) => {
            if (err) {
              console.error('❌ Session destruction error:', err);
            } else {
              console.log('✅ Session destroyed successfully');
            }
          });
        } catch (destroyError) {
          console.error('❌ Session destroy exception:', destroyError);
        }
      }
      
      // Then call passport logout with safe error handling
      try {
        if (req.logout) {
          req.logout({ keepSessionInfo: false }, (err) => {
            if (err) {
              console.error('❌ Passport logout error:', err);
            } else {
              console.log('✅ Passport logout successful');
            }
          });
        }
      } catch (passportError) {
        console.error('❌ Passport logout exception:', passportError);
        // Continue with cleanup even if Passport fails
      }
      
      // Clear session cookie
      res.clearCookie('connect.sid'); // default session cookie name
      console.log('✅ Session cookie cleared');
    }
    
    // Also clear any other possible session cookies
    res.clearCookie('connect.sid', { path: '/' });
    res.clearCookie('session', { path: '/' });
    
    console.log('✅ Logout process completed');
    
    res.json({
      success: true,
      message: 'Logged out successfully',
      clearedSession: hasSession,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('💥 Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Safe logout endpoint - no Passport dependencies
router.post('/logout-safe', (req, res) => {
  try {
    console.log('🚪 Safe logout request received');
    
    // Manually clear session without Passport
    if (req.session) {
      try {
        // Store session ID for logging
        const sessionId = req.sessionID;
        console.log('🗑️ Destroying session:', sessionId);
        
        req.session.destroy((err) => {
          if (err) {
            console.error('❌ Session destruction error:', err);
          } else {
            console.log('✅ Session destroyed successfully');
          }
        });
      } catch (sessionError) {
        console.error('❌ Session handling error:', sessionError);
      }
    }
    
    // Clear session cookies with multiple options
    const cookieOptions = [
      {},
      { path: '/' },
      { domain: 'localhost', path: '/' },
      { httpOnly: true, path: '/' },
      { secure: false, path: '/' }
    ];
    
    const cookieNames = ['connect.sid', 'session', 'sess', 'express.sid'];
    
    cookieNames.forEach(cookieName => {
      cookieOptions.forEach(options => {
        res.clearCookie(cookieName, options);
      });
    });
    
    console.log('✅ All cookies cleared');
    console.log('✅ Safe logout completed successfully');
    
    res.json({
      success: true,
      message: 'Safe logout successful',
      method: 'session-only',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Safe logout error:', error);
    // Even if there's an error, try to clear cookies
    res.clearCookie('connect.sid');
    res.clearCookie('session');
    
    res.status(500).json({
      success: false,
      message: 'Safe logout failed',
      error: error.message
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
      console.log('🔍 Checking session authentication...');
      console.log('  req.isAuthenticated exists:', !!req.isAuthenticated);
      console.log('  req.user exists:', !!req.user);
      console.log('  Session ID:', req.sessionID);
      
      if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        user = req.user;
        authMethod = 'session';
        console.log('✅ Session authentication successful');
        console.log('  User from session:', req.user.email);
      } else {
        console.log('❌ No valid session found');
      }
    } catch (sessionError) {
      console.log('❌ Session check failed:', sessionError.message);
      // Continue to JWT check
    }
    
    // Check 2: JWT-based authentication (fallback if no session)
    if (!user) {
      const authHeader = req.header('Authorization');
      console.log('🔍 Checking JWT authentication...');
      console.log('Auth header present:', !!authHeader);
      console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const jwt = require('jsonwebtoken');
          const User = require('../models/User');
          
          const token = authHeader.substring(7);
          console.log('🎫 Token received, length:', token.length);
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log('✅ JWT verification successful, user ID:', decoded.id);
          
          const jwtUser = await User.findById(decoded.id).select('-password');
          console.log('👤 User found in database:', !!jwtUser);
          
          if (jwtUser && jwtUser.isActive) {
            user = jwtUser;
            authMethod = 'jwt';
            console.log('✅ JWT authentication successful');
          } else {
            console.log('❌ User not found or inactive');
          }
        } catch (jwtError) {
          console.log('❌ JWT check failed:', jwtError.message);
          console.log('JWT Error details:', jwtError.name);
          // Continue without user
        }
      } else {
        console.log('❌ No valid Authorization header found');
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
      console.log('❌ Authentication failed - no user found');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
  } catch (error) {
    console.error('💥 Auth check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication check failed'
    });
  }
});

// JWT-only authentication check endpoint
router.get('/me-jwt', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No valid authorization token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    
    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    return res.json({
      success: true,
      user: user.toAuthJSON(),
      authMethod: 'jwt'
    });

  } catch (error) {
    console.error('JWT auth check error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication check failed'
    });
  }
});

// Simplified logout for JWT-only (just returns success)
router.post('/logout-jwt', (req, res) => {
  // In JWT-only system, logout is handled client-side by removing token
  res.json({
    success: true,
    message: 'Logged out successfully',
    note: 'JWT token should be removed from client storage'
  });
});

// JWT-only Google OAuth callback
router.get('/google-jwt/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false // Disable session for JWT-only
  }),
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
      console.error('Google OAuth JWT callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_callback_failed`);
    }
  }
);

// JWT-only Facebook OAuth callback
router.get('/facebook-jwt/callback', 
  passport.authenticate('facebook', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false // Disable session for JWT-only
  }),
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
      console.error('Facebook OAuth JWT callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_callback_failed`);
    }
  }
);

// JWT-only Google OAuth initiation
router.get('/google-jwt', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false // Disable session for JWT-only
}));

// JWT-only Facebook OAuth initiation
router.get('/facebook-jwt', passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
  session: false // Disable session for JWT-only
}));

module.exports = router; 