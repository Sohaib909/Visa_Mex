const Content = require('../models/Content');
const Upload = require('../models/Upload');

// Get content by section and language (Public endpoint)
const getContentBySection = async (req, res) => {
  try {
    const { section, language = 'EN' } = req.params;
    
    const content = await Content.getBySection(section, language);
    
    res.status(200).json({
      success: true,
      data: content,
      count: content.length
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
};

// Get all content for admin dashboard
const getAllContent = async (req, res) => {
  try {
    const { section, language, type, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (section) query.section = section;
    if (language) query.language = language;
    if (type) query.type = type;
    
    const skip = (page - 1) * limit;
    
    const content = await Content.find(query)
      .populate('lastModifiedBy', 'firstName lastName email')
      .sort({ section: 1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Content.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: content,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
};

// Create new content
const createContent = async (req, res) => {
  try {
    const { section, type, language, data, order, isActive } = req.body;
    
    // Validation
    if (!section || !type || !language || !data) {
      return res.status(400).json({
        success: false,
        message: 'Section, type, language, and data are required'
      });
    }
    
    // Create content
    const content = new Content({
      section,
      type,
      language,
      data,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      lastModifiedBy: req.user._id
    });
    
    await content.save();
    
    // Populate the response
    await content.populate('lastModifiedBy', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create content'
    });
  }
};

// Update content
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    updateData.lastModifiedBy = req.user._id;
    
    const content = await Content.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('lastModifiedBy', 'firstName lastName email');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content'
    });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findByIdAndDelete(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content'
    });
  }
};

// Bulk update content order
const updateContentOrder = async (req, res) => {
  try {
    const { items } = req.body; // Array of {id, order}
    
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }
    
    const bulkOperations = items.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { 
          order: item.order,
          lastModifiedBy: req.user._id
        }
      }
    }));
    
    await Content.bulkWrite(bulkOperations);
    
    res.status(200).json({
      success: true,
      message: 'Content order updated successfully'
    });
  } catch (error) {
    console.error('Update content order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content order'
    });
  }
};

// Toggle content status
const toggleContentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    content.isActive = !content.isActive;
    content.lastModifiedBy = req.user._id;
    await content.save();
    
    res.status(200).json({
      success: true,
      message: `Content ${content.isActive ? 'activated' : 'deactivated'} successfully`,
      data: content
    });
  } catch (error) {
    console.error('Toggle content status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle content status'
    });
  }
};

// Get specific content types for dropdowns/selects
const getContentOptions = async (req, res) => {
  try {
    const sections = await Content.distinct('section');
    const types = await Content.distinct('type');
    const languages = await Content.distinct('language');
    
    res.status(200).json({
      success: true,
      data: {
        sections,
        types,
        languages
      }
    });
  } catch (error) {
    console.error('Get content options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content options'
    });
  }
};

// Get content analytics
const getContentAnalytics = async (req, res) => {
  try {
    const analytics = await Content.aggregate([
      {
        $group: {
          _id: {
            section: '$section',
            language: '$language'
          },
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactive: { $sum: { $cond: ['$isActive', 0, 1] } }
        }
      },
      {
        $group: {
          _id: '$_id.section',
          languages: {
            $push: {
              language: '$_id.language',
              count: '$count',
              active: '$active',
              inactive: '$inactive'
            }
          },
          totalCount: { $sum: '$count' }
        }
      }
    ]);
    
    const totalContent = await Content.countDocuments();
    const activeContent = await Content.countDocuments({ isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        analytics,
        summary: {
          total: totalContent,
          active: activeContent,
          inactive: totalContent - activeContent
        }
      }
    });
  } catch (error) {
    console.error('Get content analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content analytics'
    });
  }
};

module.exports = {
  getContentBySection,
  getAllContent,
  createContent,
  updateContent,
  deleteContent,
  updateContentOrder,
  toggleContentStatus,
  getContentOptions,
  getContentAnalytics
}; 