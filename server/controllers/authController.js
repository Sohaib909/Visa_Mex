const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

// Email transporter setup
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@mexvisa.com',
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

// Generate 4-digit verification code
const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('Registration request received:', { 
      email: req.body.email, 
      signUpAsAgency: req.body.signUpAsAgency,
      signUpAsAgencyType: typeof req.body.signUpAsAgency
    });
    const { firstName, lastName, email, password, phoneNumber, signUpAsAgency } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Determine user role based on signUpAsAgency
    const userRole = signUpAsAgency === true ? 'agency' : 'user';

    // Create new user (not verified yet)
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      role: userRole,
      isEmailVerified: false
    });

    // Generate email verification code
    const verificationCode = generateVerificationCode();
    user.emailVerificationToken = verificationCode;
    user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send verification email
    try {
      const emailHtml = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #5576D9; font-size: 36px; margin: 0;">MEXVISA</h1>
          </div>
          <h2 style="color: #1B3276;">Welcome to MexVisa!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for registering with MexVisa. Please use the following verification code to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #5576D9; color: white; padding: 20px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${verificationCode}
            </div>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">This is an automated email. Please do not reply.</p>
        </div>
      `;

      await sendEmail(user.email, 'MexVisa - Email Verification', emailHtml);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      data: {
        userId: user._id,
        email: user.email,
        message: 'Verification code sent to your email'
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log('Login attempt received:', { email: req.body.email, hasPassword: !!req.body.password });
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toAuthJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Verify email with code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and verification code'
      });
    }

    // Find user and include verification fields
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+emailVerificationToken +emailVerificationExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check if code exists and hasn't expired
    if (!user.emailVerificationToken || user.emailVerificationExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Check if code matches
    if (user.emailVerificationToken !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    // Generate token for automatic login
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Email verified successfully. You can now login.',
      data: {
        user: user.toAuthJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    user.emailVerificationToken = verificationCode;
    user.emailVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send verification email
    try {
      const emailHtml = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #5576D9; font-size: 36px; margin: 0;">MEXVISA</h1>
          </div>
          <h2 style="color: #1B3276;">Email Verification</h2>
          <p>Hello ${user.firstName},</p>
          <p>Here's your new verification code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #5576D9; color: white; padding: 20px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${verificationCode}
            </div>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `;

      await sendEmail(user.email, 'MexVisa - New Verification Code', emailHtml);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.json({
      success: true,
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Forgot password - send reset code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address'
      });
    }

    // Generate reset password code
    const resetCode = generateVerificationCode();
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send password reset email
    try {
      const emailHtml = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #5576D9; font-size: 36px; margin: 0;">MEXVISA</h1>
          </div>
          <h2 style="color: #1B3276;">Password Reset Request</h2>
          <p>Hello ${user.firstName},</p>
          <p>You requested to reset your password. Please use the following verification code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #5576D9; color: white; padding: 20px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
              ${resetCode}
            </div>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `;

      await sendEmail(user.email, 'MexVisa - Password Reset Code', emailHtml);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }

    res.json({
      success: true,
      message: 'Password reset code sent to your email',
      data: {
        email: user.email
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password with verification code
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword, confirmPassword } = req.body;

    // Validation
    if (!email || !verificationCode || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+resetPasswordToken +resetPasswordExpire +password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if code exists and hasn't expired
    if (!user.resetPasswordToken || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new password reset.'
      });
    }

    // Check if code matches
    if (user.resetPasswordToken !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from your current password'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toAuthJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const userId = req.user._id;

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber ? phoneNumber.trim() : undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toAuthJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from your current password'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
};

// @desc    Verify Google OAuth token and login/register user
// @route   POST /api/auth/google/verify
// @access  Public
const googleTokenVerify = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify the Google token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: profilePicture } = payload;

    // Check if user already exists with Google ID
    let existingUser = await User.findOne({ googleId });
    
    if (existingUser) {
      // User exists, generate token and login
      const token = generateToken(existingUser._id);
      return res.json({
        success: true,
        message: 'Google login successful',
        user: existingUser.toAuthJSON(),
        token
      });
    }

    // Check if user exists with same email
    existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // Link Google account to existing user
      existingUser.googleId = googleId;
      existingUser.profilePicture = profilePicture;
      existingUser.authProvider = 'google';
      await existingUser.save();

      const token = generateToken(existingUser._id);
      return res.json({
        success: true,
        message: 'Google account linked and login successful',
        user: existingUser.toAuthJSON(),
        token
      });
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

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Google registration and login successful',
      user: newUser.toAuthJSON(),
      token
    });

  } catch (error) {
    console.error('Google token verification error:', error);
    
    if (error.message && error.message.includes('Token used too late')) {
      return res.status(400).json({
        success: false,
        message: 'Google token has expired. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  googleTokenVerify
}; 