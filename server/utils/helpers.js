const crypto = require('crypto');

class Helpers {
  // Generate 4-digit verification code
  static generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Generate random string (for tokens, etc.)
  static generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Calculate expiration time (default 10 minutes)
  static getExpirationTime(minutes = 10) {
    return Date.now() + minutes * 60 * 1000;
  }

  // Check if a timestamp has expired
  static isExpired(timestamp) {
    return timestamp < Date.now();
  }

  // Format error response
  static formatErrorResponse(message, errors = null) {
    const response = {
      success: false,
      message
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return response;
  }

  // Format success response
  static formatSuccessResponse(message, data = null) {
    const response = {
      success: true,
      message
    };
    
    if (data) {
      response.data = data;
    }
    
    return response;
  }

  // Sanitize user input (trim and lowercase for emails)
  static sanitizeUserInput(data) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        if (key === 'email') {
          sanitized[key] = value.toLowerCase().trim();
        } else if (key !== 'password') {
          sanitized[key] = value.trim();
        } else {
          sanitized[key] = value; // Don't trim passwords
        }
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  // Remove sensitive data from user object for client response
  static sanitizeUserForResponse(user) {
    if (!user) return null;
    
    const sanitized = user.toAuthJSON ? user.toAuthJSON() : user;
    
    // Remove any sensitive fields that might be present
    delete sanitized.password;
    delete sanitized.resetPasswordToken;
    delete sanitized.resetPasswordExpire;
    delete sanitized.emailVerificationToken;
    delete sanitized.emailVerificationExpire;
    delete sanitized.forgotPasswordToken;
    delete sanitized.forgotPasswordExpire;
    delete sanitized.loginAttempts;
    delete sanitized.lockUntil;
    
    return sanitized;
  }

  // Get user role from signUpAsAgency boolean
  static getUserRole(signUpAsAgency) {
    return signUpAsAgency === true ? 'agency' : 'user';
  }

  // Validate environment variables
  static validateEnvironmentVariables() {
    const required = ['JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
  }

  // Log with timestamp
  static log(message, data = null) {
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[${timestamp}] ${message}`, data);
    } else {
      console.log(`[${timestamp}] ${message}`);
    }
  }

  // Error log with timestamp
  static logError(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`);
    if (error) {
      console.error(error);
    }
  }
}

module.exports = Helpers; 