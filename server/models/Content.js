const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'features', 'testimonials', 'faq', 'about', 'mission'],
    index: true
  },
  
  type: {
    type: String,
    required: true,
    enum: ['title', 'subtitle', 'description', 'feature', 'testimonial', 'question', 'answer', 'cta', 'image']
  },
  
  language: {
    type: String,
    required: true,
    enum: ['EN', 'ES'],
    default: 'EN',
    index: true
  },
  
  // Flexible data structure for different content types
  data: {
    // Common fields
    title: String,
    description: String,
    text: String,
    
    // Feature specific
    iconUrl: String,
    
    // Testimonial specific
    name: String,
    image: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    
    // FAQ specific
    question: String,
    answer: String,
    
    // Hero specific
    ctaText: String,
    buttonText: String,
    
    // General purpose
    url: String,
    alt: String
  },
  
  // Display order for sections with multiple items
  order: {
    type: Number,
    default: 0
  },
  
  // Status control
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Admin who last modified
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
ContentSchema.index({ section: 1, language: 1, isActive: 1 });
ContentSchema.index({ section: 1, type: 1, language: 1 });

// Static methods for common queries
ContentSchema.statics.getBySection = function(section, language = 'EN', isActive = true) {
  return this.find({ 
    section, 
    language, 
    isActive 
  }).sort({ order: 1 });
};

ContentSchema.statics.getFeatures = function(language = 'EN') {
  return this.find({ 
    section: 'features', 
    type: 'feature',
    language, 
    isActive: true 
  }).sort({ order: 1 });
};

ContentSchema.statics.getTestimonials = function(language = 'EN') {
  return this.find({ 
    section: 'testimonials', 
    type: 'testimonial',
    language, 
    isActive: true 
  }).sort({ order: 1 });
};

ContentSchema.statics.getFAQs = function(language = 'EN') {
  return this.find({ 
    section: 'faq', 
    language, 
    isActive: true 
  }).sort({ order: 1 });
};

ContentSchema.statics.getHeroContent = function(language = 'EN') {
  return this.find({ 
    section: 'hero', 
    language, 
    isActive: true 
  });
};

module.exports = mongoose.model('Content', ContentSchema); 