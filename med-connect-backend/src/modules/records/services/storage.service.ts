import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileUtil } from '../../../common/utils/file.util';
import { RecordType } from '../../../common/constants/record-categories.constant';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private isLocalStorage: boolean;

  constructor(private configService: ConfigService) {
    this.isLocalStorage = this.configService.get('storage.provider') === 'local';

    if (!this.isLocalStorage) {
      const region = this.configService.get('storage.s3.region') || 'us-east-1';
      const accessKeyId = this.configService.get('storage.s3.accessKeyId') || '';
      const secretAccessKey = this.configService.get('storage.s3.secretAccessKey') || '';
      const bucket = this.configService.get('storage.s3.bucket') || '';

      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.bucketName = bucket;
    }
  }

  async generateUploadUrl(
    fileName: string,
    mimeType: string,
    patientId: string,
    recordId: string,
  ): Promise<{
    uploadUrl: string;
    fileKey: string;
    fields?: Record<string, string>;
  }> {
    if (this.isLocalStorage) {
      // For local storage, return a simple upload URL
      const fileKey = this.generateFileKey(patientId, recordId, fileName);
      const uploadUrl = `${this.configService.get('storage.local.publicPath')}/upload/${fileKey}`;

      return {
        uploadUrl,
        fileKey,
      };
    }

    // AWS S3 signed URL
    const fileKey = this.generateFileKey(patientId, recordId, fileName);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: mimeType,
      Metadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.configService.get('storage.s3.signedUrlExpiry'),
    });

    return {
      uploadUrl,
      fileKey,
    };
  }

  async generateDownloadUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    if (this.isLocalStorage) {
      return `${this.configService.get('storage.local.publicPath')}/${fileKey}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(fileKey: string): Promise<void> {
    if (this.isLocalStorage) {
      // For local storage, we might want to delete the file
      // This would require implementing file system operations
      return;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      // Don't throw error for cleanup operations
    }
  }

  validateFile(fileName: string, mimeType: string, fileSize: number): void {
    // Check file type
    if (!FileUtil.isAllowedFileType(mimeType)) {
      throw new BadRequestException('File type not allowed');
    }

    // Check file size
    const maxSize = this.configService.get('storage.maxFileSize', 10 * 1024 * 1024);
    if (fileSize > maxSize) {
      throw new BadRequestException(`File size exceeds maximum limit of ${maxSize} bytes`);
    }

    // Additional validation based on file type
    const fileType = FileUtil.getFileType(mimeType);
    if (fileType === 'unknown') {
      throw new BadRequestException('Unsupported file type');
    }
  }

  getFileType(mimeType: string): RecordType {
    if (mimeType.startsWith('image/')) return RecordType.IMAGE;
    if (mimeType === 'application/pdf') return RecordType.PDF;
    return RecordType.DOCUMENT;
  }

  private generateFileKey(patientId: string, recordId: string, fileName: string): string {
    const sanitizedName = FileUtil.sanitizeFileName(fileName);
    const timestamp = Date.now();
    return `records/${patientId}/${recordId}/${timestamp}-${sanitizedName}`;
  }

  async getFileMetadata(fileKey: string): Promise<{
    size?: number;
    lastModified?: Date;
    contentType?: string;
  }> {
    if (this.isLocalStorage) {
      // For local storage, return basic metadata
      return {};
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);
      return {
        size: response.ContentLength,
        lastModified: response.LastModified,
        contentType: response.ContentType,
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return {};
    }
  }
}