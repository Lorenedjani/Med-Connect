import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptionUtil } from '../../../common/utils/encryption.util';

@Injectable()
export class EncryptionService {
  private encryptionEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.encryptionEnabled = this.configService.get('storage.encryption.enabled', false);
  }

  async encryptFileData(data: Buffer): Promise<{
    encryptedData: Buffer;
    encryptionKey: string;
  }> {
    if (!this.encryptionEnabled) {
      return {
        encryptedData: data,
        encryptionKey: '',
      };
    }

    // Generate a unique encryption key for this file
    const encryptionKey = EncryptionUtil.generateSecureToken(32);
    const encryptedData = await EncryptionUtil.encrypt(data.toString('base64'), encryptionKey);

    return {
      encryptedData: Buffer.from(encryptedData, 'utf8'),
      encryptionKey,
    };
  }

  async decryptFileData(encryptedData: Buffer, encryptionKey: string): Promise<Buffer> {
    if (!this.encryptionEnabled || !encryptionKey) {
      return encryptedData;
    }

    try {
      const decryptedString = await EncryptionUtil.decrypt(
        encryptedData.toString('utf8'),
        encryptionKey,
      );
      return Buffer.from(decryptedString, 'base64');
    } catch (error) {
      console.error('Error decrypting file data:', error);
      throw new Error('Failed to decrypt file data');
    }
  }

  shouldEncryptFile(mimeType: string): boolean {
    if (!this.encryptionEnabled) return false;

    // Encrypt sensitive file types
    const sensitiveTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    return sensitiveTypes.includes(mimeType.toLowerCase());
  }

  async rotateEncryptionKey(
    oldKey: string,
    newKey?: string,
  ): Promise<string> {
    const keyToUse = newKey || EncryptionUtil.generateSecureToken(32);

    // In a real implementation, this would:
    // 1. Decrypt data with old key
    // 2. Encrypt data with new key
    // 3. Update the database with new key
    // 4. Schedule cleanup of old key

    return keyToUse;
  }

  validateEncryptionKey(key: string): boolean {
    // Basic validation - key should be a non-empty string
    return typeof key === 'string' && key.length > 0;
  }

  async generateFileChecksum(data: Buffer): Promise<string> {
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }

  async verifyFileIntegrity(data: Buffer, expectedChecksum: string): Promise<boolean> {
    const actualChecksum = await this.generateFileChecksum(data);
    return actualChecksum === expectedChecksum;
  }
}