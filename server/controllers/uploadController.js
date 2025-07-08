const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Upload = require('../models/Upload');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload single file
const uploadSingle = upload.single('file');

// Upload multiple files
const uploadMultiple = upload.array('files', 10);

// Handle single file upload
const handleSingleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { section, type, contentId } = req.body;

    // Create upload record
    const uploadRecord = new Upload({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      category: 'image',
      relatedTo: {
        section,
        type,
        contentId: contentId || null
      },
      uploadedBy: req.user._id
    });

    await uploadRecord.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: uploadRecord._id,
        filename: uploadRecord.filename,
        originalName: uploadRecord.originalName,
        url: uploadRecord.url,
        size: uploadRecord.size,
        mimeType: uploadRecord.mimeType
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if database save failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('File cleanup error:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
};

// Handle multiple file uploads
const handleMultipleUploads = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { section, type } = req.body;
    const uploadRecords = [];

    for (const file of req.files) {
      const uploadRecord = new Upload({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/uploads/${file.filename}`,
        category: 'image',
        relatedTo: {
          section,
          type
        },
        uploadedBy: req.user._id
      });

      await uploadRecord.save();
      uploadRecords.push({
        id: uploadRecord._id,
        filename: uploadRecord.filename,
        originalName: uploadRecord.originalName,
        url: uploadRecord.url,
        size: uploadRecord.size,
        mimeType: uploadRecord.mimeType
      });
    }

    res.status(201).json({
      success: true,
      message: `${uploadRecords.length} files uploaded successfully`,
      data: uploadRecords
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    
    // Clean up files if database save failed
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('File cleanup error:', unlinkError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
};

// Get all uploads
const getAllUploads = async (req, res) => {
  try {
    const { category, section, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (section) query['relatedTo.section'] = section;
    
    const skip = (page - 1) * limit;
    
    const uploads = await Upload.find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Upload.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: uploads,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch uploads'
    });
  }
};

// Delete upload
const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params;
    
    const upload = await Upload.findById(id);
    
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }
    
    // Delete file from filesystem
    try {
      await fs.unlink(upload.path);
    } catch (fileError) {
      console.error('File deletion error:', fileError);
    }
    
    // Delete record from database
    await Upload.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Upload deleted successfully'
    });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete upload'
    });
  }
};

// Get upload analytics
const getUploadAnalytics = async (req, res) => {
  try {
    const analytics = await Upload.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ]);
    
    const totalUploads = await Upload.countDocuments({ isActive: true });
    const totalSize = await Upload.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        analytics,
        summary: {
          totalFiles: totalUploads,
          totalSize: totalSize[0]?.total || 0
        }
      }
    });
  } catch (error) {
    console.error('Upload analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upload analytics'
    });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleSingleUpload,
  handleMultipleUploads,
  getAllUploads,
  deleteUpload,
  getUploadAnalytics
}; 