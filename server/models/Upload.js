const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  
  originalName: {
    type: String,
    required: true
  },
  
  mimeType: {
    type: String,
    required: true
  },
  
  size: {
    type: Number,
    required: true
  },
  
  path: {
    type: String,
    required: true
  },
  
  url: {
    type: String,
    required: true
  },
  
  // File category
  category: {
    type: String,
    enum: ['image', 'document', 'video', 'audio'],
    default: 'image'
  },
  
  // Related content
  relatedTo: {
    section: String,
    type: String,
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content'
    }
  },
  
  // Upload metadata
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
UploadSchema.index({ category: 1, isActive: 1 });
UploadSchema.index({ uploadedBy: 1 });
UploadSchema.index({ 'relatedTo.section': 1, 'relatedTo.type': 1 });

module.exports = mongoose.model('Upload', UploadSchema); 