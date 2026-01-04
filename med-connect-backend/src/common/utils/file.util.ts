import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileUtil {
  static generateFileName(originalName: string): string {
    const extension = extname(originalName);
    const timestamp = Date.now();
    const randomId = uuidv4().substring(0, 8);

    return `${timestamp}-${randomId}${extension}`;
  }

  static getFileExtension(filename: string): string {
    return extname(filename).toLowerCase();
  }

  static getFileType(mimeType: string): string {
    const types = {
      'image/': 'image',
      'application/pdf': 'pdf',
      'application/msword': 'document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
      'text/': 'text',
      'application/': 'document',
    };

    for (const [prefix, type] of Object.entries(types)) {
      if (mimeType.startsWith(prefix)) {
        return type;
      }
    }

    return 'unknown';
  }

  static isAllowedFileType(mimeType: string, allowedTypes?: string[]): boolean {
    const defaultAllowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const typesToCheck = allowedTypes || defaultAllowedTypes;
    return typesToCheck.includes(mimeType);
  }

  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  static validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
    return size <= maxSize;
  }

  static sanitizeFileName(filename: string): string {
    // Remove or replace dangerous characters
    return filename
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100); // Limit length
  }

  static getMimeTypeFromExtension(extension: string): string {
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}

