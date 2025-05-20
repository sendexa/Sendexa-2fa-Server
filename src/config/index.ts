interface SenderConfig {
  sms: string[];
  email: string[];
}

interface ApiKeyConfig {
  senderIds: SenderConfig;
  rateLimit: number; // requests per minute
  ttl: number; // OTP expiry in seconds
}

// In-memory API key registry
const apiKeyRegistry: Record<string, ApiKeyConfig> = {
  'test-api-key': {
    senderIds: {
      sms: ['MyAppVerify', 'Sendexa'],
      email: ['noreply@myapp.com', 'verify@myapp.com']
    },
    rateLimit: 1,
    ttl: 300 // 5 minutes
  }
};

export const config = {
  apiKeyRegistry,
  defaultTTL: 300, // 5 minutes
  defaultRateLimit: 1, // 1 request per minute
  otpLength: 6,
  maxRetries: 3
};

export const validateApiKey = (apiKey: string): boolean => {
  return apiKey in apiKeyRegistry;
};

export const getApiKeyConfig = (apiKey: string): ApiKeyConfig | null => {
  return apiKeyRegistry[apiKey] || null;
};

export const validateSenderId = (apiKey: string, channel: 'sms' | 'email', senderId: string): boolean => {
  const config = getApiKeyConfig(apiKey);
  if (!config) return false;
  return config.senderIds[channel].includes(senderId);
}; 