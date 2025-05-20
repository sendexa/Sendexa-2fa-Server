export interface OTPRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
  channel: 'sms' | 'email';
  senderId: string;
}

export interface SenderConfig {
  sms: string[];
  email: string[];
}

export interface ApiKeyConfig {
  senderIds: SenderConfig;
  rateLimit: number;
  ttl: number;
}

export interface SMSPayload {
  to: string;
  message: string;
  sender_id: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from: string;
} 