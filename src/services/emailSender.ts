import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from: string;
}

export class EmailSender {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Real SMTP transporter using .env variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOTP(destination: string, otp: string, senderId: string, expiryMinutes: number): Promise<boolean> {
    try {
      // Split OTP into prefix and digits
      // const prefix = otp.slice(0, 4);
      const digits = otp.slice(4);
      const payload: EmailPayload = {
        to: destination,
        from: senderId || process.env.EMAIL_FROM || '',
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verification Code</h2>
            <p>Your verification code is: <strong style="font-size: 22px;">${digits}</strong></p>
            <p>This code will expire in ${expiryMinutes} minute${expiryMinutes === 1 ? '' : 's'}.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      };

      await this.transporter.sendMail(payload);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const emailSender = new EmailSender(); 