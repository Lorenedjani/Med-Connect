import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  provider: process.env.STORAGE_PROVIDER || 's3', // 's3', 'local', 'azure'

  // AWS S3 Configuration
  s3: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET || 'med-connect-files',
    endpoint: process.env.AWS_S3_ENDPOINT,
    publicRead: process.env.AWS_S3_PUBLIC_READ === 'true',
    signedUrlExpiry: parseInt(process.env.AWS_S3_SIGNED_URL_EXPIRY || '3600', 10), // 1 hour
    maxFileSize: parseInt(process.env.AWS_S3_MAX_FILE_SIZE || '10485760', 10), // 10MB
  },

  // Local storage configuration (for development)
  local: {
    uploadPath: process.env.LOCAL_UPLOAD_PATH || './uploads',
    publicPath: process.env.LOCAL_PUBLIC_PATH || '/uploads',
    maxFileSize: parseInt(process.env.LOCAL_MAX_FILE_SIZE || '10485760', 10),
  },

  // Azure Blob Storage configuration
  azure: {
    accountName: process.env.AZURE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_ACCOUNT_KEY,
    containerName: process.env.AZURE_CONTAINER_NAME || 'med-connect-files',
    signedUrlExpiry: parseInt(process.env.AZURE_SIGNED_URL_EXPIRY || '3600', 10),
  },

  // File organization
  folders: {
    medicalRecords: 'medical-records',
    profilePictures: 'profile-pictures',
    documents: 'documents',
    temp: 'temp',
  },

  // Encryption
  encryption: {
    enabled: process.env.FILE_ENCRYPTION_ENABLED === 'true',
    algorithm: process.env.FILE_ENCRYPTION_ALGORITHM || 'aes-256-gcm',
    key: process.env.FILE_ENCRYPTION_KEY,
  },

  // Image processing
  image: {
    resizeEnabled: process.env.IMAGE_RESIZE_ENABLED === 'true',
    maxWidth: parseInt(process.env.IMAGE_MAX_WIDTH || '1920', 10),
    maxHeight: parseInt(process.env.IMAGE_MAX_HEIGHT || '1080', 10),
    quality: parseInt(process.env.IMAGE_QUALITY || '80', 10),
    formats: process.env.IMAGE_FORMATS?.split(',') || ['jpeg', 'png', 'webp'],
  },
}));
