import { Request, Response } from "express";
import { sendOTPRequest, verifyOTPRequest, resendOTPRequest } from "../services/otp.service";

// Controller to handle OTP request
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email, method } = req.body; // method: 'sms' or 'email'
    
    if (!phoneNumber && !email) {
      return res.status(400).json({ message: "Phone number or email is required." });
    }

    const otp = await sendOTPRequest(phoneNumber, email, method);
    return res.status(200).json({ message: "OTP sent successfully.", otp });

  } catch (error) {
    return res.status(500).json({ message: "Failed to request OTP.", error: error.message });
  }
};

// Controller to handle OTP verification
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email, otp } = req.body;

    if (!phoneNumber && !email) {
      return res.status(400).json({ message: "Phone number or email is required." });
    }

    const isValid = await verifyOTPRequest(phoneNumber, email, otp);
    if (isValid) {
      return res.status(200).json({ message: "OTP verified successfully." });
    } else {
      return res.status(400).json({ message: "Invalid OTP." });
    }

  } catch (error) {
    return res.status(500).json({ message: "Failed to verify OTP.", error: error.message });
  }
};

// Controller to handle OTP resend
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email, method } = req.body;

    if (!phoneNumber && !email) {
      return res.status(400).json({ message: "Phone number or email is required." });
    }

    const otp = await resendOTPRequest(phoneNumber, email, method);
    return res.status(200).json({ message: "OTP resent successfully.", otp });

  } catch (error) {
    return res.status(500).json({ message: "Failed to resend OTP.", error: error.message });
  }
};
