import { Request, Response } from "express";
import { generateOTP, formatPhoneNumber } from '../../utils/otp';
import { otpStore } from '../../store/otpStore';
import { smsSender } from '../../services/smsSender';
import { emailSender } from '../../services/emailSender';
import { getApiKeyConfig } from '../../config';

// Controller to handle OTP request
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { destination, channel, sender_id } = req.body;
    const apiKey = req.headers['x-api-key'] as string;
    const config = getApiKeyConfig(apiKey);

    if (!config) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key configuration'
      });
    }

    // Format phone number if SMS channel
    const formattedDestination = channel === 'sms' 
      ? formatPhoneNumber(destination)
      : destination;

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + (config.ttl * 1000);

    // Store OTP
    otpStore.set(formattedDestination, {
      otp,
      expiresAt,
      attempts: 0,
      channel,
      senderId: sender_id
    });

    // Send OTP
    const sent = channel === 'sms'
      ? await smsSender.sendOTP(formattedDestination, otp, sender_id)
      : await emailSender.sendOTP(formattedDestination, otp, sender_id);

    if (!sent) {
      otpStore.delete(formattedDestination);
      return res.status(500).json({
        success: false,
        message: `Failed to send OTP via ${channel}`
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('OTP request failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Controller to handle OTP verification
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { destination, otp } = req.body;
    const record = otpStore.get(destination);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this destination'
      });
    }

    if (record.expiresAt < Date.now()) {
      otpStore.delete(destination);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    const attempts = otpStore.incrementAttempts(destination);
    if (attempts > 3) {
      otpStore.delete(destination);
      return res.status(400).json({
        success: false,
        message: 'Too many attempts. Please request a new OTP'
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid, remove it from store
    otpStore.delete(destination);

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('OTP verification failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Controller to handle OTP resend
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { destination, channel, sender_id } = req.body;
    const record = otpStore.get(destination);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this destination'
      });
    }

    if (record.expiresAt < Date.now()) {
      otpStore.delete(destination);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one'
      });
    }

    // Resend the same OTP
    const sent = channel === 'sms'
      ? await smsSender.sendOTP(destination, record.otp, sender_id)
      : await emailSender.sendOTP(destination, record.otp, sender_id);

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: `Failed to resend OTP via ${channel}`
      });
    }

    res.json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    console.error('OTP resend failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
