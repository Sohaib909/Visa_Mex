const express = require('express');
const router = express.Router();

// Import controllers
const {
  getContentBySection,
  getAllContent,
  createContent,
  updateContent,
  deleteContent,
  updateContentOrder,
  toggleContentStatus,
  getContentOptions,
  getContentAnalytics
} = require('../controllers/contentController');

const {
  uploadSingle,
  uploadMultiple,
  handleSingleUpload,
  handleMultipleUploads,
  getAllUploads,
  deleteUpload,
  getUploadAnalytics
} = require('../controllers/uploadController');

// Import middleware
const { requireContentManagement, requireFileUpload, verifyAdmin } = require('../middleware/adminAuth');
const { protect } = require('../middleware/auth'); // Existing auth middleware

// =============================================================================
// PUBLIC ROUTES (No authentication required)
// =============================================================================

// Get content by section and language for frontend
router.get('/content/:section/:language?', getContentBySection);

// Get hero content specifically
router.get('/hero/:language?', async (req, res) => {
  req.params.section = 'hero';
  return getContentBySection(req, res);
});

// Get features specifically  
router.get('/features/:language?', async (req, res) => {
  req.params.section = 'features';
  return getContentBySection(req, res);
});

// Get testimonials specifically
router.get('/testimonials/:language?', async (req, res) => {
  req.params.section = 'testimonials';
  return getContentBySection(req, res);
});

// Get FAQ specifically
router.get('/faq/:language?', async (req, res) => {
  req.params.section = 'faq';
  return getContentBySection(req, res);
});

// =============================================================================
// ADMIN ROUTES (Authentication + Admin permissions required)
// =============================================================================

// Content Management Routes
router.use('/admin', verifyAdmin); // All admin routes require admin authentication

// Get all content with filtering and pagination
router.get('/admin/content', getAllContent);

// Get content options for dropdowns
router.get('/admin/content/options', getContentOptions);

// Get content analytics
router.get('/admin/content/analytics', getContentAnalytics);

// Create new content
router.post('/admin/content', requireContentManagement, createContent);

// Update existing content
router.put('/admin/content/:id', requireContentManagement, updateContent);

// Delete content
router.delete('/admin/content/:id', requireContentManagement, deleteContent);

// Bulk update content order
router.patch('/admin/content/order', requireContentManagement, updateContentOrder);

// Toggle content status (active/inactive)
router.patch('/admin/content/:id/toggle', requireContentManagement, toggleContentStatus);

// =============================================================================
// FILE UPLOAD ROUTES (Admin authentication required)
// =============================================================================

// Single file upload
router.post('/admin/upload/single', requireFileUpload, uploadSingle, handleSingleUpload);

// Multiple file upload
router.post('/admin/upload/multiple', requireFileUpload, uploadMultiple, handleMultipleUploads);

// Get all uploads with filtering
router.get('/admin/uploads', getAllUploads);

// Delete upload
router.delete('/admin/uploads/:id', requireFileUpload, deleteUpload);

// Upload analytics
router.get('/admin/uploads/analytics', getUploadAnalytics);

// =============================================================================
// CONTENT MANAGEMENT SPECIFIC ROUTES
// =============================================================================

// Hero Section Management
router.get('/admin/hero', requireContentManagement, async (req, res) => {
  req.query.section = 'hero';
  return getAllContent(req, res);
});

router.post('/admin/hero', requireContentManagement, async (req, res) => {
  req.body.section = 'hero';
  return createContent(req, res);
});

// Features Management  
router.get('/admin/features', requireContentManagement, async (req, res) => {
  req.query.section = 'features';
  return getAllContent(req, res);
});

router.post('/admin/features', requireContentManagement, async (req, res) => {
  req.body.section = 'features';
  req.body.type = 'feature';
  return createContent(req, res);
});

// Testimonials Management
router.get('/admin/testimonials', requireContentManagement, async (req, res) => {
  req.query.section = 'testimonials';
  return getAllContent(req, res);
});

router.post('/admin/testimonials', requireContentManagement, async (req, res) => {
  req.body.section = 'testimonials';
  req.body.type = 'testimonial';
  return createContent(req, res);
});

// FAQ Management
router.get('/admin/faqs', requireContentManagement, async (req, res) => {
  req.query.section = 'faq';
  return getAllContent(req, res);
});

router.post('/admin/faqs', requireContentManagement, async (req, res) => {
  req.body.section = 'faq';
  return createContent(req, res);
});

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

// Batch create content (for seeding or bulk import)
router.post('/admin/content/batch', requireContentManagement, async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const item = { ...items[i], lastModifiedBy: req.user._id };
        const content = new (require('../models/Content'))(item);
        const saved = await content.save();
        results.push(saved);
      } catch (error) {
        errors.push({ index: i, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Batch operation completed. ${results.length} items created, ${errors.length} errors.`,
      data: {
        created: results,
        errors: errors
      }
    });
  } catch (error) {
    console.error('Batch create error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch operation failed'
    });
  }
});

// Batch delete content
router.delete('/admin/content/batch', requireContentManagement, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'IDs array is required'
      });
    }

    const result = await (require('../models/Content')).deleteMany({
      _id: { $in: ids }
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} items deleted successfully`
    });
  } catch (error) {
    console.error('Batch delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch delete failed'
    });
  }
});

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

// Handle multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
  }
  
  if (error.message === 'Invalid file type. Only images are allowed.') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

module.exports = router; 