interface OTPRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
  channel: 'sms' | 'email';
  senderId: string;
}

class OTPStore {
  private store: Map<string, OTPRecord>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.store = new Map();
    // Clean up expired OTPs every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  set(destination: string, record: OTPRecord): void {
    this.store.set(destination, record);
  }

  get(destination: string): OTPRecord | undefined {
    return this.store.get(destination);
  }

  delete(destination: string): void {
    this.store.delete(destination);
  }

  incrementAttempts(destination: string): number {
    const record = this.store.get(destination);
    if (!record) return 0;
    
    record.attempts += 1;
    this.store.set(destination, record);
    return record.attempts;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [destination, record] of this.store.entries()) {
      if (record.expiresAt < now) {
        this.store.delete(destination);
      }
    }
  }

  // Clean up resources when shutting down
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Export a singleton instance
export const otpStore = new OTPStore(); 