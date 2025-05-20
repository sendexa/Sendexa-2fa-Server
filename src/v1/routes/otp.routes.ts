import { Router } from "express";
import {
  requestOTP,
  verifyOTP,
  resendOTP
} from "../controllers/otp.controller";
import { apiKeyAuth } from '../../middleware/auth';
import { validateOTPRequest, validateOTPVerify } from '../../middleware/validators';
import { rateLimit } from '../../middleware/rateLimiter';

const router = Router();

// Helper to wrap async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Apply API key authentication to all routes
router.use(apiKeyAuth);

// Request OTP - with rate limiting and validation
router.post(
  "/request",
  rateLimit,
  validateOTPRequest,
  asyncHandler(requestOTP)
);

// Verify OTP - with validation
router.post(
  "/verify",
  validateOTPVerify,
  asyncHandler(verifyOTP)
);

// Resend OTP - with rate limiting and validation
router.post(
  "/resend",
  rateLimit,
  validateOTPRequest,
  asyncHandler(resendOTP)
);

export default router;

