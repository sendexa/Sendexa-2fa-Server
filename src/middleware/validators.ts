import { Request, Response, NextFunction } from 'express';
import { validateEmail, validatePhone } from '../utils/otp';
import { validateSenderId } from '../config';

export const validateOTPRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { destination, channel, sender_id } = req.body;
  const apiKey = req.headers['x-api-key'] as string;

  if (!destination || !channel || !sender_id) {
    res.status(400).json({
      success: false,
      message: 'Missing required fields: destination, channel, or sender_id'
    });
    return;
  }

  if (channel !== 'sms' && channel !== 'email') {
    res.status(400).json({
      success: false,
      message: 'Invalid channel. Must be either "sms" or "email"'
    });
    return;
  }

  const isValidDestination = channel === 'sms' 
    ? validatePhone(destination)
    : validateEmail(destination);

  if (!isValidDestination) {
    res.status(400).json({
      success: false,
      message: `Invalid ${channel} destination format`
    });
    return;
  }

  if (!validateSenderId(apiKey, channel, sender_id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid sender_id for the specified channel'
    });
    return;
  }

  next();
};

export const validateOTPVerify = (req: Request, res: Response, next: NextFunction): void => {
  const { destination, otp } = req.body;

  if (!destination || !otp) {
    res.status(400).json({
      success: false,
      message: 'Missing required fields: destination or otp'
    });
    return;
  }

  if (typeof otp !== 'string' || otp.length !== 6 || !/^\d+$/.test(otp)) {
    res.status(400).json({
      success: false,
      message: 'Invalid OTP format. Must be 6 digits'
    });
    return;
  }

  next();
}; 