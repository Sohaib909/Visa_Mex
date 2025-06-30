const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // Initialize email transporter
  createTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    return this.transporter;
  }

  // Generic email sending method
  async sendEmail(to, subject, html) {
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@mexvisa.com',
        to,
        subject,
        html
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
      return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }

  // Email template for verification code
  createVerificationEmailTemplate(firstName, verificationCode, title = 'Email Verification') {
    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #5576D9; font-size: 36px; margin: 0;">VISAMEX</h1>
        </div>
        <h2 style="color: #1B3276;">${title}</h2>
        <p>Hello ${firstName},</p>
        <p>Please use the following verification code:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #5576D9; color: white; padding: 20px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${verificationCode}
          </div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">This is an automated email. Please do not reply.</p>
      </div>
    `;
  }

  // Welcome email template for new registration
  createWelcomeEmailTemplate(firstName, verificationCode) {
    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #5576D9; font-size: 36px; margin: 0;">VISAMEX</h1>
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
  }

  // Password reset email template
  createPasswordResetEmailTemplate(firstName, resetCode) {
    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #5576D9; font-size: 36px; margin: 0;">VISAMEX</h1>
        </div>
        <h2 style="color: #1B3276;">Password Reset Request</h2>
        <p>Hello ${firstName},</p>
        <p>You requested to reset your password. Please use the following verification code:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #5576D9; color: white; padding: 20px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${resetCode}
          </div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">This is an automated email. Please do not reply.</p>
      </div>
    `;
  }

  // Send welcome verification email
  async sendWelcomeVerification(email, firstName, verificationCode) {
    const html = this.createWelcomeEmailTemplate(firstName, verificationCode);
    return await this.sendEmail(email, 'MexVisa - Email Verification', html);
  }

  // Send new verification code
  async sendNewVerificationCode(email, firstName, verificationCode) {
    const html = this.createVerificationEmailTemplate(firstName, verificationCode, 'New Verification Code');
    return await this.sendEmail(email, 'MexVisa - New Verification Code', html);
  }

  // Send password reset code
  async sendPasswordResetCode(email, firstName, resetCode) {
    const html = this.createPasswordResetEmailTemplate(firstName, resetCode);
    return await this.sendEmail(email, 'MexVisa - Password Reset Code', html);
  }
}

module.exports = new EmailService(); 