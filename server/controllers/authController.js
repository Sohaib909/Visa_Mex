const AuthService = require('../services/authService');
const EmailService = require('../services/emailService');
const TokenService = require('../services/tokenService');
const Validators = require('../utils/validators');
const Helpers = require('../utils/helpers');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    Helpers.log('Registration request received:', { 
      email: req.body.email, 
      signUpAsAgency: req.body.signUpAsAgency 
    });

    // Sanitize and validate input
    const sanitizedData = Helpers.sanitizeUserInput(req.body);
    const validation = Validators.validateRegistrationData(sanitizedData);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', validation.errors)
      );
    }

    // Store pending registration (doesn't create user yet)
    const { email, verificationCode, isNewRegistration } = await AuthService.storePendingRegistration(sanitizedData);

    // Send verification email
    try {
      await EmailService.sendWelcomeVerification(
        email, 
        sanitizedData.firstName, 
        verificationCode
      );
      
      Helpers.log('Verification email sent successfully', { email });
    } catch (emailError) {
      Helpers.logError('Email sending failed:', emailError);
      return res.status(500).json(
        Helpers.formatErrorResponse('Registration processed but failed to send verification email. Please try again.')
      );
    }

    const message = isNewRegistration 
      ? 'Registration initiated successfully! Please check your email and enter the 4-digit verification code to complete your account creation.'
      : 'New verification code sent! Please check your email and enter the 4-digit verification code to complete your account creation.';

    res.status(200).json(Helpers.formatSuccessResponse(message, {
      email,
      message: 'Your account will be created once you verify your email address',
      verificationRequired: true,
      expiresIn: '30 minutes'
    }));

  } catch (error) {
    Helpers.logError('Register error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', messages)
      );
    }

    res.status(500).json(
      Helpers.formatErrorResponse(error.message || 'Server error during registration')
    );
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    Helpers.log('Login attempt received:', { 
      email: req.body.email, 
      hasPassword: !!req.body.password 
    });

    // Sanitize and validate input
    const sanitizedData = Helpers.sanitizeUserInput(req.body);
    const validation = Validators.validateLoginData(sanitizedData);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', validation.errors)
      );
    }

    const { email, password } = sanitizedData;

    // Find user with password
    const user = await AuthService.findUserByEmail(email, true);
    
    if (!user) {
      return res.status(401).json(
        Helpers.formatErrorResponse('Incorrect username or password.')
      );
    }

    // Validate user for login
    try {
      await AuthService.validateUserForLogin(user);
    } catch (validationError) {
      if (validationError.requiresVerification) {
        return res.status(401).json({
          success: false,
          message: validationError.message,
          requiresVerification: true,
          email: validationError.email
        });
      }
      return res.status(401).json(
        Helpers.formatErrorResponse(validationError.message)
      );
    }

    // Verify password
    const isPasswordValid = await AuthService.verifyUserPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json(
        Helpers.formatErrorResponse('Incorrect username or password.')
      );
    }

    // Generate token
    const token = TokenService.generateToken(user._id);

    res.json(Helpers.formatSuccessResponse('Login successful', {
      user: user.toAuthJSON(),
      token
    }));

  } catch (error) {
    Helpers.logError('Login error:', error);
    res.status(500).json(
      Helpers.formatErrorResponse('Server error during login')
    );
  }
};

 
const verifyEmail = async (req, res) => {
  try {
    // Sanitize and validate input
    const sanitizedData = Helpers.sanitizeUserInput(req.body);
    const validation = Validators.validateEmailVerificationData(sanitizedData);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', validation.errors)
      );
    }

    const { email, verificationCode } = sanitizedData;

    // Verify email and create user account
    const user = await AuthService.verifyEmailCode(email, verificationCode);

    // Generate token for automatic login
    const token = TokenService.generateToken(user._id);

    Helpers.log('Email verification successful and user account created:', { 
      userId: user._id, 
      email: user.email 
    });

    res.json(Helpers.formatSuccessResponse(
      'Congratulations! Your email has been verified and your account has been created successfully. You are now logged in.',
      { 
        user, 
        token,
        message: 'Account created and verified successfully',
        accountStatus: 'created'
      }
    ));

  } catch (error) {
    Helpers.logError('Verify email error:', error);
    
    // Provide specific error messages based on error content
    let statusCode = 400;
    let errorMessage = error.message;

    if (error.message.includes('expired')) {
      statusCode = 410; // Gone
      errorMessage = error.message;
    } else if (error.message.includes('Too many failed attempts')) {
      statusCode = 429; // Too Many Requests
      errorMessage = error.message;
    } else if (error.message.includes('No pending registration')) {
      statusCode = 404; // Not Found
      errorMessage = error.message;
    }

    res.status(statusCode).json(
      Helpers.formatErrorResponse(errorMessage)
    );
  }
};

 
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Please provide email')
      );
    }

    // Generate new verification code
    const result = await AuthService.generateNewVerificationCode(email);

    // Send verification email
    try {
      if (result.isPending) {
        // For pending registrations
        await EmailService.sendNewVerificationCode(
          email, 
          'User', // We don't have firstName for pending, use generic
          result.verificationCode
        );
        
        res.json(Helpers.formatSuccessResponse(
          'New verification code sent to your email. Please check your inbox and complete your registration.',
          {
            email: result.email,
            message: 'Your account will be created once you verify your email address',
            verificationRequired: true,
            expiresIn: '30 minutes'
          }
        ));
      } else {
        // For existing users (backward compatibility)
        await EmailService.sendNewVerificationCode(
          result.user.email, 
          result.user.firstName, 
          result.verificationCode
        );
        
        res.json(Helpers.formatSuccessResponse(
          'New verification code sent to your email'
        ));
      }
    } catch (emailError) {
      Helpers.logError('Email sending failed:', emailError);
      return res.status(500).json(
        Helpers.formatErrorResponse('Failed to send verification email')
      );
    }

  } catch (error) {
    Helpers.logError('Resend verification error:', error);
    
    let statusCode = 400;
    if (error.message.includes('No pending registration')) {
      statusCode = 404;
    }
    
    res.status(statusCode).json(
      Helpers.formatErrorResponse(error.message)
    );
  }
};

 
const forgotPassword = async (req, res) => {
  try {
    // Sanitize and validate input
    const sanitizedData = Helpers.sanitizeUserInput(req.body);
    const validation = Validators.validateForgotPasswordData(sanitizedData);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', validation.errors)
      );
    }

    const { email } = sanitizedData;

    // Generate reset code
    const { user, resetCode } = await AuthService.generateForgotPasswordCode(email);

    // Send password reset email
    try {
      await EmailService.sendPasswordResetCode(
        user.email, 
        user.firstName, 
        resetCode
      );
    } catch (emailError) {
      Helpers.logError('Email sending failed:', emailError);
      return res.status(500).json(
        Helpers.formatErrorResponse('Failed to send password reset email')
      );
    }

    res.json(Helpers.formatSuccessResponse(
      'Password reset code sent to your email',
      { email: user.email }
    ));

  } catch (error) {
    Helpers.logError('Forgot password error:', error);
    res.status(404).json(
      Helpers.formatErrorResponse(error.message)
    );
  }
};

 
const resetPassword = async (req, res) => {
  try {
    // Sanitize and validate input
    const sanitizedData = Helpers.sanitizeUserInput(req.body);
    const validation = Validators.validateResetPasswordData(sanitizedData);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', validation.errors)
      );
    }

    const { email, verificationCode, newPassword } = sanitizedData;

    // Reset password through service
    await AuthService.resetPassword(email, verificationCode, newPassword);

    res.json(Helpers.formatSuccessResponse(
      'Password updated successfully. You can now login with your new password.'
    ));

  } catch (error) {
    Helpers.logError('Reset password error:', error);
    res.status(400).json(
      Helpers.formatErrorResponse(error.message)
    );
  }
};

 
const getProfile = async (req, res) => {
  try {
    res.json(Helpers.formatSuccessResponse(
      'Profile retrieved successfully',
      { user: req.user.toAuthJSON() }
    ));
  } catch (error) {
    Helpers.logError('Get profile error:', error);
    res.status(500).json(
      Helpers.formatErrorResponse('Server error retrieving profile')
    );
  }
};

 
const updateProfile = async (req, res) => {
  try {
    // Sanitize and validate input
    const sanitizedData = Helpers.sanitizeUserInput(req.body);
    const validation = Validators.validateProfileUpdateData(sanitizedData);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', validation.errors)
      );
    }

    // Update profile through service
    const user = await AuthService.updateUserProfile(req.user._id, sanitizedData);

    res.json(Helpers.formatSuccessResponse(
      'Profile updated successfully',
      { user }
    ));

  } catch (error) {
    Helpers.logError('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', messages)
      );
    }

    res.status(500).json(
      Helpers.formatErrorResponse('Server error updating profile')
    );
  }
};

 
const changePassword = async (req, res) => {
  try {
    // Sanitize and validate input
    const sanitizedData = Helpers.sanitizeUserInput(req.body);
    const validation = Validators.validateChangePasswordData(sanitizedData);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', validation.errors)
      );
    }

    const { currentPassword, newPassword } = sanitizedData;

    // Change password through service
    await AuthService.changeUserPassword(req.user._id, currentPassword, newPassword);

    res.json(Helpers.formatSuccessResponse('Password changed successfully'));

  } catch (error) {
    Helpers.logError('Change password error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(
        Helpers.formatErrorResponse('Validation error', messages)
      );
    }

    res.status(400).json(
      Helpers.formatErrorResponse(error.message)
    );
  }
};


const googleTokenVerify = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Google credential is required')
      );
    }

    // Handle Google OAuth through service
    const user = await AuthService.handleGoogleOAuth(credential);

    // Generate token
    const token = TokenService.generateToken(user._id);

    res.json(Helpers.formatSuccessResponse(
      'Google authentication successful',
      { user, token }
    ));

  } catch (error) {
    Helpers.logError('Google token verification error:', error);
    
    if (error.message && error.message.includes('Token used too late')) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Google token has expired. Please try again.')
      );
    }

    res.status(500).json(
      Helpers.formatErrorResponse('Google authentication failed')
    );
  }
};

 
const checkRegistrationStatus = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json(
        Helpers.formatErrorResponse('Email parameter is required')
      );
    }

    // Check if user already exists in database
    const existingUser = await AuthService.findUserByEmail(email);
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.json(Helpers.formatSuccessResponse(
          'Account already exists and is verified',
          {
            status: 'completed',
            canLogin: true,
            message: 'You can log in with your existing account'
          }
        ));
      } else {
        return res.json(Helpers.formatSuccessResponse(
          'Account exists but email verification is pending',
          {
            status: 'pending_verification',
            canResendCode: true,
            message: 'Please verify your email to complete registration'
          }
        ));
      }
    }

    // Check pending registrations
    const pendingInfo = await AuthService.getPendingRegistrationInfo(email);
    if (pendingInfo) {
      const timeLeft = Math.max(0, Math.floor((pendingInfo.expiresAt - Date.now()) / (1000 * 60))); // minutes
      
      return res.json(Helpers.formatSuccessResponse(
        'Registration is in progress',
        {
          status: 'pending_registration',
          firstName: pendingInfo.firstName,
          lastName: pendingInfo.lastName,
          timeLeftMinutes: timeLeft,
          attemptsRemaining: pendingInfo.attemptsRemaining,
          canResendCode: true,
          message: 'Please verify your email to complete account creation'
        }
      ));
    }

    // No registration found
    res.json(Helpers.formatSuccessResponse(
      'No registration found',
      {
        status: 'not_found',
        canRegister: true,
        message: 'Please start the registration process'
      }
    ));

  } catch (error) {
    Helpers.logError('Check registration status error:', error);
    res.status(500).json(
      Helpers.formatErrorResponse('Error checking registration status')
    );
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerificationCode,
  checkRegistrationStatus,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  googleTokenVerify
}; 