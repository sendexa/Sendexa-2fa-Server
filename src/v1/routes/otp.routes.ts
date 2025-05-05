import { Router } from "express";
import {
  requestOTP,
  verifyOTP,
  resendOTP
} from "../controllers/otp.controller";

const router = Router();

router.post("/request", requestOTP);
router.post("/verify", verifyOTP);
router.post("/resend", resendOTP);

export default router;

