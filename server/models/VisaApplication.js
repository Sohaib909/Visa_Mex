const mongoose = require('mongoose');

const visaApplicationSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  
  applicationDetails: {
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      default: 'Mexico'
    },
    destination: {
      type: String,
      required: [true, 'Destination country is required'],
      default: 'Australia'
    },
    visaType: {
      type: String,
      default: 'Australia Visitor Visa'
    }
  },
  
  // Trip Details (Step 1)
  tripDetails: {
    arrivalDate: {
      type: Date,
      required: [true, 'Arrival date is required']
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required']
    },
    contactEmail: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true
    },
    receiveUpdates: {
      type: Boolean,
      default: false
    }
  },
  
  // Personal Information (Step 2)
  personalInfo: {
    firstAndMiddleName: {
      type: String,
      required: [true, 'First and middle name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    dateOfBirth: {
      month: {
        type: String,
        required: [true, 'Birth month is required']
      },
      day: {
        type: String,
        required: [true, 'Birth day is required']
      },
      year: {
        type: String,
        required: [true, 'Birth year is required']
      }
    }
  },
  
  // Passport Information (Step 2 continued)
  passportInfo: {
    passportDocument: {
      fileName: String,
      filePath: String,
      uploadedAt: Date
    },
    ownsAssets: {
      type: String,
      enum: ['yes', 'no'],
      required: [true, 'Assets ownership status is required']
    },
    travelHistory: {
      type: String,
      enum: [
        'no_travel',
        'traveled_returned', 
        'traveled_visa_countries'
      ],
      required: [true, 'Travel history is required']
    },
    previousVisaApplication: {
      applied: {
        type: String,
        enum: ['no', 'yes'],
        required: [true, 'Previous visa application status is required']
      },
      denialDetails: {
        type: String,
        enum: ['less_than_12_months', 'more_than_12_months'],
        required: function() {
          return this.passportInfo.previousVisaApplication.applied === 'yes';
        }
      }
    }
  },
  
  // Appointment Selection (Step 2 continued)
  appointmentDetails: {
    location: {
      type: String,
      enum: ['Tijuana, Mexico', 'Ecatepec, Mexico', 'León, Mexico'],
      required: [true, 'Appointment location is required']
    },
    selectedDate: Date,
    selectedTime: String
  },
  
  // Processing and Fees (Step 3)
  processingDetails: {
    processingType: {
      type: String,
      enum: ['standard', 'express', 'urgent'],
      default: 'standard'
    },
    governmentFees: {
      type: Number,
      default: 0
    },
    processingFees: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required']
    }
  },
  
  
  visaDetails: {
    validity: {
      type: String,
      default: '1 year after arrival'
    },
    maxStay: {
      type: String,
      default: '90 days per entry'
    },
    entryType: {
      type: String,
      default: 'Multiple entry'
    }
  },
  
  // Payment Information
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ['paypal', 'card'],
      required: [true, 'Payment method is required']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentDate: Date,
    cardDetails: {
      cardNumber: String, 
      expiryMonth: String,
      expiryYear: String,
      cardholderName: String,
      cvv: String 
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    }
  },
  
  // Travelers Information
  travelers: [{
    name: {
      type: String,
      required: [true, 'Traveler name is required']
    },
    isMainApplicant: {
      type: Boolean,
      default: false
    }
  }],
  
  // Application Progress
  currentStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  completedSteps: {
    tripDetails: { type: Boolean, default: false },
    personalInfo: { type: Boolean, default: false },
    checkout: { type: Boolean, default: false }
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'submitted', 'under_review', 'approved', 'rejected', 'cancelled'],
    default: 'draft'
  },
  
  // Status History
  statusHistory: [{
    status: {
      type: String,
      enum: ['draft', 'pending', 'submitted', 'under_review', 'approved', 'rejected', 'cancelled'],
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    comment: String
  }],
  
  // Admin Review
  reviewNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  
  // Application Dates
  submittedAt: Date,
  completedAt: Date
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
visaApplicationSchema.index({ userId: 1 });
visaApplicationSchema.index({ applicationNumber: 1 });
visaApplicationSchema.index({ status: 1 });
visaApplicationSchema.index({ createdAt: -1 });
visaApplicationSchema.index({ 'applicationDetails.destination': 1 });
visaApplicationSchema.index({ 'applicationDetails.nationality': 1 });
visaApplicationSchema.index({ 'paymentDetails.paymentStatus': 1 });

// Pre-save middleware to generate application number
visaApplicationSchema.pre('save', function(next) {
  if (!this.applicationNumber) {
    // Generate application number: VM + year + random 6 digits
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.applicationNumber = `VM${year}${randomNum}`;
  }
  next();
});

// Virtual for application age in days
visaApplicationSchema.virtual('applicationAge').get(function() {
  return Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Instance method to update status
visaApplicationSchema.methods.updateStatus = function(newStatus, userId, comment) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    comment: comment
  });
  
  if (newStatus === 'submitted') {
    this.submittedAt = new Date();
  } else if (['approved', 'rejected', 'cancelled'].includes(newStatus)) {
    this.completedAt = new Date();
  }
};

// Instance method to update application step progres
visaApplicationSchema.methods.updateProgress = function(step, completed = true) {
  if (step === 1 || step === 'tripDetails') {
    this.completedSteps.tripDetails = completed;
    this.currentStep = Math.max(this.currentStep, 2);
  } else if (step === 2 || step === 'personalInfo') {
    this.completedSteps.personalInfo = completed;
    this.currentStep = Math.max(this.currentStep, 3);
  } else if (step === 3 || step === 'checkout') {
    this.completedSteps.checkout = completed;
    if (completed) {
      this.status = 'pending';
    }
  }
};


visaApplicationSchema.methods.calculateTotal = function() {
  return this.processingDetails.governmentFees + this.processingDetails.processingFees;
};


visaApplicationSchema.virtual('formattedApplicationNumber').get(function() {
  return this.applicationNumber || 'Pending';
});

module.exports = mongoose.model('VisaApplication', visaApplicationSchema); 