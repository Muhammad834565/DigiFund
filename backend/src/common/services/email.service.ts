import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize email transporter
    // For development, you can use services like Ethereal, Gmail, or SendGrid
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>(
          'EMAIL_FROM',
          '"DigiFund" <noreply@digifund.com>',
        ),
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOtpEmail(
    email: string,
    otp: string,
    purpose: string,
  ): Promise<void> {
    const subject =
      purpose === 'signup'
        ? 'Verify Your Email - DigiFund'
        : 'Reset Your Password - DigiFund';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f4f4f4; }
          .otp-box { background: white; padding: 20px; margin: 20px 0; text-align: center; border: 2px dashed #4CAF50; }
          .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DigiFund</h1>
          </div>
          <div class="content">
            <h2>${purpose === 'signup' ? 'Welcome to DigiFund!' : 'Password Reset Request'}</h2>
            <p>Your One-Time Password (OTP) is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP is valid for 3 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>You have 5 attempts to enter the correct OTP</li>
            </ul>
            <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 DigiFund. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
      text: `Your OTP is: ${otp}. Valid for 3 minutes.`,
    });
  }

  async sendInvoiceEmail(
    to: string,
    invoiceNumber: string,
    billFrom: string,
    billTo: string,
    amount: number,
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f4f4f4; }
          .invoice-details { background: white; padding: 20px; margin: 20px 0; }
          .amount { font-size: 24px; font-weight: bold; color: #2196F3; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Invoice</h1>
          </div>
          <div class="content">
            <h2>Invoice #${invoiceNumber}</h2>
            <div class="invoice-details">
              <p><strong>From:</strong> ${billFrom}</p>
              <p><strong>To:</strong> ${billTo}</p>
              <p><strong>Amount:</strong> <span class="amount">$${amount}</span></p>
            </div>
            <p>Please log in to your DigiFund account to view the complete invoice details.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `Invoice #${invoiceNumber} - DigiFund`,
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f4f4f4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DigiFund!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your account has been successfully verified. You can now access all features of DigiFund.</p>
            <p>Get started by:</p>
            <ul>
              <li>Creating your first invoice</li>
              <li>Adding inventory items</li>
              <li>Connecting with suppliers and consumers</li>
              <li>Tracking your finances</li>
            </ul>
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to DigiFund!',
      html,
    });
  }
}
