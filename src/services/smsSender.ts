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

  async sendOTP(destination: string, otp: string, senderId: string): Promise<boolean> {
    try {
      const payload: SMSPayload = {
        to: destination,
        message: `Your verification code is: ${otp}. Valid for 5 minutes.`,
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