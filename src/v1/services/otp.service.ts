import { generateOTP } from "../utils/otpGenerator";
import { sendSMS, sendEmail } from "./smsSender"; // We'll define these senders in future

// Mock store to keep OTPs in memory
let otpStore: { [key: string]: { otp: string; expiresAt: number } } = {};

// OTP Request (Generate and Send)
export const sendOTPRequest = async (phoneNumber: string, email: string, method: string) => {
  const otp = generateOTP(); // Generate a 6-digit OTP
  const ttl = 300000; // Time-to-live for OTP in milliseconds (5 minutes)
  const expiresAt = Date.now() + ttl;

  // Store OTP in memory (with expiration)
  if (phoneNumber) otpStore[phoneNumber] = { otp, expiresAt };
  if (email) otpStore[email] = { otp, expiresAt };

  // Send OTP based on method
  if (method === "sms" && phoneNumber) {
    await sendSMS(phoneNumber, otp);
  } else if (method === "email" && email) {
    await sendEmail(email, otp);
  } else {
    throw new Error("Invalid method or missing contact details");
  }

  return otp; // Return OTP for debugging purposes (can be removed later)
};

// OTP Verification (Check if valid)
export const verifyOTPRequest = async (phoneNumber: string, email: string, otp: string) => {
  const storedOTP = otpStore[phoneNumber] || otpStore[email];
  if (!storedOTP) {
    throw new Error("OTP not found.");
  }

  if (storedOTP.otp === otp && Date.now() < storedOTP.expiresAt) {
    delete otpStore[phoneNumber || email]; // Clear OTP after validation
    return true; // OTP is valid
  } else {
    return false; // Invalid or expired OTP
  }
};

// OTP Resend (Regenerate OTP and send again)
export const resendOTPRequest = async (phoneNumber: string, email: string, method: string) => {
  return sendOTPRequest(phoneNumber, email, method); // Just call sendOTPRequest again
};
