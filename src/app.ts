import express from "express";
import otpRoutes from "./v1/routes/otp.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/v1/otp", otpRoutes);

export default app;
