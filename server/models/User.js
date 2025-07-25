const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      
      return !this.googleId && !this.facebookId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false 
  },
  
  
  role: {
    type: String,
    enum: ['user', 'agency', 'admin'],
    default: 'user'
  },
  
  // Admin permissions for content management
  permissions: {
    canManageContent: {
      type: Boolean,
      default: function() { return this.role === 'admin'; }
    },
    canManageUsers: {
      type: Boolean,
      default: function() { return this.role === 'admin'; }
    },
    canUploadFiles: {
      type: Boolean,
      default: function() { return this.role === 'admin' || this.role === 'agency'; }
    },
    canViewAnalytics: {
      type: Boolean,
      default: function() { return this.role === 'admin'; }
    }
  },
  
  // Last admin activity
  lastAdminActivity: {
    type: Date,
    default: null
  },
  
  // OAuth Fields
  googleId: {
    type: String,
    sparse: true 
  },
  facebookId: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  
  
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  phoneNumber: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  
}, {
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});


userSchema.virtual('isAgency').get(function() {
  return this.role === 'agency';
});


userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });


userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) return next();
  
  try {
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Authentication and user methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Admin permission methods
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.canManageContent = function() {
  return this.role === 'admin' && this.permissions.canManageContent;
};

userSchema.methods.canUploadFiles = function() {
  return (this.role === 'admin' || this.role === 'agency') && this.permissions.canUploadFiles;
};

userSchema.methods.updateAdminActivity = function() {
  if (this.role === 'admin') {
    this.lastAdminActivity = new Date();
    return this.save();
  }
};

// User data formatting methods
userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    isAgency: this.isAgency,
    isAdmin: this.isAdmin(),
    permissions: this.permissions,
    isActive: this.isActive,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('User', userSchema); 