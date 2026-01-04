import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export class EncryptionUtil {
  private static algorithm = 'aes-256-cbc';
  private static keyLength = 32;
  private static ivLength = 16;
  private static saltRounds = 12;

  static async encrypt(text: string, key?: string): Promise<string> {
    const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const iv = randomBytes(this.ivLength);

    const cipher = createCipheriv(this.algorithm, await this.deriveKey(encryptionKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return format: iv:encryptedData
    return `${iv.toString('hex')}:${encrypted}`;
  }

  static async decrypt(encryptedText: string, key?: string): Promise<string> {
    const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const parts = encryptedText.split(':');

    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    const decipher = createDecipheriv(this.algorithm, await this.deriveKey(encryptionKey), iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  private static async deriveKey(password: string): Promise<Buffer> {
    const salt = process.env.ENCRYPTION_SALT || 'default-salt-change-in-production';
    const scryptAsync = promisify(scrypt);
    return scryptAsync(password, salt, this.keyLength) as Promise<Buffer>;
  }

  static hashPassword(password: string): Promise<string> {
    // Using bcrypt for password hashing
    const bcrypt = require('bcrypt');
    return bcrypt.hash(password, this.saltRounds);
  }

  static comparePassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(password, hash);
  }

  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  static generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }
}
