import { registerAs } from '@nestjs/config';

export default registerAs('encryption', () => ({
  algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
  key: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key-here', // Must be 32 bytes
  ivLength: parseInt(process.env.ENCRYPTION_IV_LENGTH || '16', 10),

  // File encryption
  fileEncryption: {
    enabled: process.env.FILE_ENCRYPTION_ENABLED === 'true',
    key: process.env.FILE_ENCRYPTION_KEY || 'your-file-encryption-key-32-chars',
    algorithm: process.env.FILE_ENCRYPTION_ALGORITHM || 'aes-256-cbc',
  },

  // Database encryption
  databaseEncryption: {
    enabled: process.env.DB_ENCRYPTION_ENABLED === 'true',
    fields: process.env.DB_ENCRYPTED_FIELDS?.split(',') || [
      'medical_records.content',
      'messages.content',
      'personal_data.ssn',
      'personal_data.phone',
    ],
  },

  // Key rotation
  keyRotation: {
    enabled: process.env.KEY_ROTATION_ENABLED === 'true',
    interval: parseInt(process.env.KEY_ROTATION_INTERVAL || '30', 10), // days
    oldKeysRetention: parseInt(process.env.OLD_KEYS_RETENTION || '90', 10), // days
  },

  // Hashing for sensitive data
  hashing: {
    algorithm: process.env.HASHING_ALGORITHM || 'argon2id',
    saltRounds: parseInt(process.env.HASH_SALT_ROUNDS || '12', 10),
  },

  // Compliance
  compliance: {
    hipaaCompliant: true,
    gdprCompliant: true,
    auditEncryption: process.env.AUDIT_ENCRYPTION_ENABLED === 'true',
  },
}));
