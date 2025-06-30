const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const Helpers = require('../utils/helpers');
const Validators = require('../utils/validators');

// In-memory storage for pending registrations
// In production, you might want to use Redis or a dedicated temporary collection
const pendingRegistrations = new Map();

// Clean up expired pending registrations every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingRegistrations.entries()) {
    if (now > data.expiresAt) {
      pendingRegistrations.delete(email);
    }
  }
}, 30 * 60 * 1000); // 30 minutes

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  // Store pending registration data temporarily
  async storePendingRegistration(userData) {
    const { firstName, lastName, email, password, phoneNumber, signUpAsAgency } = userData;
    
    // Check if user already exists in database
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if there's already a pending registration for this email
    const pendingEmail = email.toLowerCase();
    if (pendingRegistrations.has(pendingEmail)) {
      // Update existing pending registration with new data and new verification code
      const existingPending = pendingRegistrations.get(pendingEmail);
      const verificationCode = Helpers.generateVerificationCode();
      
      pendingRegistrations.set(pendingEmail, {
        ...existingPending,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
        phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
        signUpAsAgency,
        verificationCode,
        expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes from now
        attempts: 0 // Reset attempts counter
      });

      return {
        email: pendingEmail,
        verificationCode,
        isNewRegistration: false
      };
    }

    // Create new pending registration
    const verificationCode = Helpers.generateVerificationCode();
    const userRole = Helpers.getUserRole(signUpAsAgency);

    pendingRegistrations.set(pendingEmail, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: pendingEmail,
      password,
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      role: userRole,
      verificationCode,
      expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes from now
      attempts: 0,
      createdAt: Date.now()
    });

    return {
      email: pendingEmail,
      verificationCode,
      isNewRegistration: true
    };
  }

  // Legacy method kept for compatibility - now delegates to storePendingRegistration
  async registerUser(userData) {
    return await this.storePendingRegistration(userData);
  }

  // Find user by email
  async findUserByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    
    if (includePassword) {
      query.select('+password');
    }
    
    return await query;
  }

  // Find user by ID
  async findUserById(userId) {
    return await User.findById(userId);
  }

  // Verify user's password
  async verifyUserPassword(user, password) {
    return await user.comparePassword(password);
  }

  // Verify email with code and create actual user account
  async verifyEmailCode(email, verificationCode) {
    const normalizedEmail = email.toLowerCase();
    
    // First check if user already exists in database
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new Error('Email is already verified and account exists');
      }
      // If user exists but not verified, handle the old flow
      return await this.verifyExistingUserEmail(existingUser, verificationCode);
    }

    // Check pending registrations
    const pendingData = pendingRegistrations.get(normalizedEmail);
    if (!pendingData) {
      throw new Error('No pending registration found for this email. Please start the registration process again.');
    }

    // Check if verification code has expired
    if (Date.now() > pendingData.expiresAt) {
      pendingRegistrations.delete(normalizedEmail);
      throw new Error('Verification code has expired. Please register again.');
    }

    // Check verification code
    if (pendingData.verificationCode !== verificationCode) {
      pendingData.attempts += 1;
      
      // Allow maximum 3 attempts
      if (pendingData.attempts >= 3) {
        pendingRegistrations.delete(normalizedEmail);
        throw new Error('Too many failed attempts. Please register again.');
      }
      
      throw new Error(`Invalid verification code. ${3 - pendingData.attempts} attempts remaining.`);
    }

    // Verification successful - create actual user account
    try {
      const newUser = await User.create({
        firstName: pendingData.firstName,
        lastName: pendingData.lastName,
        email: pendingData.email,
        password: pendingData.password,
        phoneNumber: pendingData.phoneNumber,
        role: pendingData.role,
        isEmailVerified: true // Email is verified since they provided correct code
      });

      // Remove from pending registrations
      pendingRegistrations.delete(normalizedEmail);

      return Helpers.sanitizeUserForResponse(newUser);
    } catch (error) {
      // If user creation fails, keep pending registration for retry
      throw new Error('Failed to create user account. Please try again.');
    }
  }

  // Handle verification for users created with old flow (backward compatibility)
  async verifyExistingUserEmail(user, verificationCode) {
    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    if (!user.emailVerificationToken || Helpers.isExpired(user.emailVerificationExpire)) {
      throw new Error('Verification code has expired. Please request a new one.');
    }

    if (user.emailVerificationToken !== verificationCode) {
      throw new Error('Invalid verification code');
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    return Helpers.sanitizeUserForResponse(user);
  }

  // Generate new verification code for pending registration
  async generateNewVerificationCode(email) {
    const normalizedEmail = email.toLowerCase();
    
    // First check if user exists in database (old flow)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new Error('Email is already verified');
      }
      // Handle old flow
      const verificationCode = Helpers.generateVerificationCode();
      existingUser.emailVerificationToken = verificationCode;
      existingUser.emailVerificationExpire = Helpers.getExpirationTime(10);
      await existingUser.save();

      return {
        user: Helpers.sanitizeUserForResponse(existingUser),
        verificationCode
      };
    }

    // Check pending registrations
    const pendingData = pendingRegistrations.get(normalizedEmail);
    if (!pendingData) {
      throw new Error('No pending registration found for this email. Please start the registration process again.');
    }

    // Generate new verification code and extend expiration
    const verificationCode = Helpers.generateVerificationCode();
    pendingData.verificationCode = verificationCode;
    pendingData.expiresAt = Date.now() + (30 * 60 * 1000); // Extend by 30 minutes
    pendingData.attempts = 0; // Reset attempts

    return {
      email: normalizedEmail,
      verificationCode,
      isPending: true
    };
  }

  // Get pending registration info for display purposes
  getPendingRegistrationInfo(email) {
    const normalizedEmail = email.toLowerCase();
    const pendingData = pendingRegistrations.get(normalizedEmail);
    
    if (!pendingData) {
      return null;
    }

    return {
      email: pendingData.email,
      firstName: pendingData.firstName,
      lastName: pendingData.lastName,
      expiresAt: pendingData.expiresAt,
      attemptsRemaining: 3 - pendingData.attempts
    };
  }

  // Check if email has pending registration
  hasPendingRegistration(email) {
    const normalizedEmail = email.toLowerCase();
    const pendingData = pendingRegistrations.get(normalizedEmail);
    
    if (!pendingData) {
      return false;
    }

    // Check if not expired
    return Date.now() <= pendingData.expiresAt;
  }

  // Generate forgot password code
  async generateForgotPasswordCode(email) {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new Error('No account found with that email address');
    }

    const resetCode = Helpers.generateVerificationCode();
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpire = Helpers.getExpirationTime(10);
    await user.save();

    return {
      user: Helpers.sanitizeUserForResponse(user),
      resetCode
    };
  }

  // Reset password with verification code
  async resetPassword(email, verificationCode, newPassword) {
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+resetPasswordToken +resetPasswordExpire +password');

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.resetPasswordToken || Helpers.isExpired(user.resetPasswordExpire)) {
      throw new Error('Verification code has expired. Please request a new password reset.');
    }

    if (user.resetPasswordToken !== verificationCode) {
      throw new Error('Invalid verification code');
    }

    // Check if new password is different from current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      throw new Error('New password must be different from your current password');
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return Helpers.sanitizeUserForResponse(user);
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const { firstName, lastName, phoneNumber } = updateData;

    // Update fields if provided
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phoneNumber !== undefined) {
      user.phoneNumber = phoneNumber ? phoneNumber.trim() : undefined;
    }

    await user.save();
    return Helpers.sanitizeUserForResponse(user);
  }

  // Change user password
  async changeUserPassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Check if new password is different
    if (currentPassword === newPassword) {
      throw new Error('New password must be different from your current password');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return Helpers.sanitizeUserForResponse(user);
  }

  // Handle Google OAuth
  async handleGoogleOAuth(credential) {
    // Verify the Google token
    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { 
      sub: googleId, 
      email, 
      given_name: firstName, 
      family_name: lastName, 
      picture: profilePicture 
    } = payload;

    // Check if user already exists with Google ID
    let existingUser = await User.findOne({ googleId });
    
    if (existingUser) {
      return Helpers.sanitizeUserForResponse(existingUser);
    }

    // Check if user exists with same email
    existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // Link Google account to existing user
      existingUser.googleId = googleId;
      existingUser.profilePicture = profilePicture;
      existingUser.authProvider = 'google';
      await existingUser.save();

      return Helpers.sanitizeUserForResponse(existingUser);
    }

    // Create new user with Google OAuth
    const newUser = await User.create({
      googleId,
      firstName: firstName || 'Google',
      lastName: lastName || 'User',
      email: email.toLowerCase(),
      profilePicture,
      authProvider: 'google',
      isEmailVerified: true, // Google emails are pre-verified
      role: 'user' // Default role
    });

    return Helpers.sanitizeUserForResponse(newUser);
  }

  // Check if user account is valid for login
  async validateUserForLogin(user) {
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    if (!user.isEmailVerified) {
      const error = new Error('Please verify your email before logging in');
      error.requiresVerification = true;
      error.email = user.email;
      throw error;
    }

    return true;
  }
}

module.exports = new AuthService(); 