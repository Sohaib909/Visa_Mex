const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify admin authentication
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    if (!user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Update admin activity
    await user.updateAdminActivity();
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Check specific content management permission
const checkContentPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      const hasPermission = req.user.permissions[permission];
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${permission} permission required.`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed.'
      });
    }
  };
};

// Combined middleware for content management
const requireContentManagement = [
  verifyAdmin,
  checkContentPermission('canManageContent')
];

// Combined middleware for file upload
const requireFileUpload = [
  verifyAdmin,
  checkContentPermission('canUploadFiles')
];

module.exports = {
  verifyAdmin,
  checkContentPermission,
  requireContentManagement,
  requireFileUpload
}; 