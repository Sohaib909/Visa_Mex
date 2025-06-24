const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/test
// @desc    Test route - Public
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Visa-Mex API Test Route is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// @route   GET /api/test/protected
// @desc    Test protected route
// @access  Private
router.get('/protected', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully!',
    user: req.user.toAuthJSON(),
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/test/admin
// @desc    Test admin route
// @access  Private (Admin only)
router.get('/admin', auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Admin route accessed successfully!',
    user: req.user.toAuthJSON(),
    timestamp: new Date().toISOString()
  });
});

// @route   POST /api/test/echo
// @desc    Echo back the request body
// @access  Public
router.post('/echo', (req, res) => {
  res.json({
    success: true,
    message: 'Echo test route',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 