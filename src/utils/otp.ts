import { config } from '../config';

// function generatePrefix(length: number = 4): string {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   let prefix = '';
//   for (let i = 0; i < length; i++) {
//     prefix += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return prefix;
// }

export const generateOTP = (length?: number): string => {
  const digits = '0123456789';
  let otp = '';
  const otpLength = length || config.otpLength;
  for (let i = 0; i < otpLength; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  // const prefix = generatePrefix(4);
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