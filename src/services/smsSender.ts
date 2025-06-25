import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface SMSPayload {
  to: string;
  message: string;
  sender_id: string;
}

export class SMSSender {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.SMS_API_KEY || '';
    this.apiUrl = process.env.SMS_API_URL || '';
  }

  async sendOTP(destination: string, otp: string, senderId: string, expiryMinutes: number): Promise<boolean> {
    try {
      // Split OTP into prefix and digits
      // const prefix = otp.slice(0, 4);
      const digits = otp.slice(4);
      const payload: SMSPayload = {
        to: destination,
        message: `Your verification code is: ${digits}. Valid for ${expiryMinutes} minute${expiryMinutes === 1 ? '' : 's'}.`,
        sender_id: senderId
      };

      // For testing: Log the OTP instead of sending
      console.log('TEST MODE - SMS OTP:', {
        destination,
        otp,
        senderId,
        message: payload.message
      });

      // In production, uncomment this:
      // const response = await axios.post(this.apiUrl, payload, {
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // return response.status === 200;

      return true; // Always return true in test mode
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const smsSender = new SMSSender(); 