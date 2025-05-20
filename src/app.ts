import express, { Express } from 'express';
import dotenv from 'dotenv';
import otpRoutes from "./v1/routes/otp.routes";
import { requestLogger } from './middleware/logger';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/v1/otp", otpRoutes);

// Error handling
app.use(function (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;
