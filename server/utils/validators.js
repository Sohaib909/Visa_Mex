class Validators {
  // Email validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation
  static isValidPassword(password) {
    return password && password.length >= 6;
  }

  // Phone number validation (basic)
  static isValidPhoneNumber(phoneNumber) {
    if (!phoneNumber) return true; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
  }

  // Name validation
  static isValidName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
  }

  // Verification code validation (4 digits)
  static isValidVerificationCode(code) {
    return code && /^\d{4}$/.test(code);
  }

  // Validate registration data
  static validateRegistrationData(data) {
    const errors = [];
    const { firstName, lastName, email, password, phoneNumber } = data;

    if (!this.isValidName(firstName)) {
      errors.push('First name must be between 2 and 50 characters');
    }

    if (!this.isValidName(lastName)) {
      errors.push('Last name must be between 2 and 50 characters');
    }

    if (!this.isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!this.isValidPassword(password)) {
      errors.push('Password must be at least 6 characters long');
    }

    if (phoneNumber && !this.isValidPhoneNumber(phoneNumber)) {
      errors.push('Please provide a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate login data
  static validateLoginData(data) {
    const errors = [];
    const { email, password } = data;

    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate email verification data
  static validateEmailVerificationData(data) {
    const errors = [];
    const { email, verificationCode } = data;

    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!verificationCode) {
      errors.push('Verification code is required');
    } else if (!this.isValidVerificationCode(verificationCode)) {
      errors.push('Verification code must be 4 digits');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate forgot password data
  static validateForgotPasswordData(data) {
    const errors = [];
    const { email } = data;

    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate reset password data
  static validateResetPasswordData(data) {
    const errors = [];
    const { email, verificationCode, newPassword, confirmPassword } = data;

    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!verificationCode) {
      errors.push('Verification code is required');
    } else if (!this.isValidVerificationCode(verificationCode)) {
      errors.push('Verification code must be 4 digits');
    }

    if (!newPassword) {
      errors.push('New password is required');
    } else if (!this.isValidPassword(newPassword)) {
      errors.push('New password must be at least 6 characters long');
    }

    if (!confirmPassword) {
      errors.push('Confirm password is required');
    } else if (newPassword !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate change password data
  static validateChangePasswordData(data) {
    const errors = [];
    const { currentPassword, newPassword } = data;

    if (!currentPassword) {
      errors.push('Current password is required');
    }

    if (!newPassword) {
      errors.push('New password is required');
    } else if (!this.isValidPassword(newPassword)) {
      errors.push('New password must be at least 6 characters long');
    }

    if (currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate profile update data
  static validateProfileUpdateData(data) {
    const errors = [];
    const { firstName, lastName, phoneNumber } = data;

    if (firstName && !this.isValidName(firstName)) {
      errors.push('First name must be between 2 and 50 characters');
    }

    if (lastName && !this.isValidName(lastName)) {
      errors.push('Last name must be between 2 and 50 characters');
    }

    if (phoneNumber && !this.isValidPhoneNumber(phoneNumber)) {
      errors.push('Please provide a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Validators; 