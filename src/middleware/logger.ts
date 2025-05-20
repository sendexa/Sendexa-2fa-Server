import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Log request
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - IP: ${ip}`);

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });

  next();
}; 