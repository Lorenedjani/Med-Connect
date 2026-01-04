import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Med-Connect',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8080'],
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || '1',

  // Security
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),

  // Rate limiting
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
  rateLimitLimit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10),

  // File upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],

  // Pagination
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
  maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),

  // OTP
  otpLength: parseInt(process.env.OTP_LENGTH || '6', 10),
  otpExpiresIn: parseInt(process.env.OTP_EXPIRES_IN || '300', 10), // 5 minutes

  // Cache
  cacheTtl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes

  // Email
  emailFrom: process.env.EMAIL_FROM || 'noreply@med-connect.com',
  emailFromName: process.env.EMAIL_FROM_NAME || 'Med-Connect',

  // SMS
  smsFrom: process.env.SMS_FROM || 'MedConnect',

  // Video calls
  videoMaxDuration: parseInt(process.env.VIDEO_MAX_DURATION || '3600', 10), // 1 hour in seconds
  videoMaxParticipants: parseInt(process.env.VIDEO_MAX_PARTICIPANTS || '2', 10),
}));
