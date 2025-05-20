import { config } from '../config';

export const generateOTP = (): string => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < config.otpLength; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Ensure it starts with country code
  if (cleaned.startsWith('0')) {
    return '233' + cleaned.slice(1);
  }
  
  return cleaned;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = formatPhoneNumber(phone);
  return cleaned.length >= 10 && cleaned.length <= 15;
}; 