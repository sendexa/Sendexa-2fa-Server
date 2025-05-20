import { Request, Response, NextFunction } from 'express';
import { getApiKeyConfig } from '../config';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitRecord>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.store = new Map();
    // Clean up expired records every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private getKey(req: Request): string {
    const apiKey = req.headers['x-api-key'] as string;
    const destination = req.body.destination;
    return `${apiKey}:${destination}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (record.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  check(req: Request): boolean {
    const key = this.getKey(req);
    const apiKey = req.headers['x-api-key'] as string;
    const config = getApiKeyConfig(apiKey);
    const limit = config?.rateLimit || 1; // Default to 1 request per minute

    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetTime < now) {
      // First request or reset time passed
      this.store.set(key, {
        count: 1,
        resetTime: now + 60000 // Reset after 1 minute
      });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count += 1;
    this.store.set(key, record);
    return true;
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

const rateLimiter = new RateLimiter();

export const rateLimit = (req: Request, res: Response, next: NextFunction): void => {
  if (!rateLimiter.check(req)) {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please try again later.'
    });
    return;
  }
  next();
}; 