import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // JWT options
  issuer: process.env.JWT_ISSUER || 'med-connect-api',
  audience: process.env.JWT_AUDIENCE || 'med-connect-clients',

  // Token storage
  redis: {
    keyPrefix: process.env.JWT_REDIS_PREFIX || 'jwt:',
    ttl: parseInt(process.env.JWT_REDIS_TTL || '604800', 10), // 7 days in seconds
  },

  // Blacklist configuration
  blacklistEnabled: process.env.JWT_BLACKLIST_ENABLED !== 'false',
  blacklistTtl: parseInt(process.env.JWT_BLACKLIST_TTL || '604800', 10), // 7 days

  // Algorithm
  algorithm: process.env.JWT_ALGORITHM || 'HS256',

  // Additional security options
  ignoreExpiration: false,
  allowInsecureKeySizes: false,
  maxAge: process.env.JWT_MAX_AGE || '7d',
}));
