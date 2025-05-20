import { Request, Response, NextFunction } from 'express';
import { validateApiKey } from '../config';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    res.status(401).json({
      success: false,
      message: 'API key is required'
    });
    return;
  }

  if (!validateApiKey(apiKey)) {
    res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
    return;
  }

  // Add API key to request for later use
  req.headers['x-api-key'] = apiKey;
  next();
}; 