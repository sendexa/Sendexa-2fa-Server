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
    // For testing, create a mock transporter
    this.transporter = {
      sendMail: async (mailOptions: any) => {
        console.log('TEST MODE - Email OTP:', {
          to: mailOptions.to,
          from: mailOptions.from,
          subject: mailOptions.subject,
          html: mailOptions.html
        });
        return { messageId: 'test-message-id' };
      }
    } as any;
  }

  async sendOTP(destination: string, otp: string, senderId: string): Promise<boolean> {
    try {
      const payload: EmailPayload = {
        to: destination,
        from: senderId,
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verification Code</h2>
            <p>Your verification code is:</p>
            <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
              <strong>${otp}</strong>
            </div>
            <p>This code will expire in 5 minutes.</p>
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