import { registerAs } from '@nestjs/config';

export default registerAs('notification', () => ({
  // Email configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid', // 'sendgrid', 'ses', 'smtp'
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      from: process.env.EMAIL_FROM || 'noreply@med-connect.com',
      fromName: process.env.EMAIL_FROM_NAME || 'Med-Connect',
    },
    ses: {
      region: process.env.AWS_SES_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      from: process.env.EMAIL_FROM || 'noreply@med-connect.com',
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      from: process.env.EMAIL_FROM || 'noreply@med-connect.com',
    },
  },

  // SMS configuration
  sms: {
    provider: process.env.SMS_PROVIDER || 'twilio', // 'twilio', 'aws-sns'
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      from: process.env.TWILIO_FROM_NUMBER,
    },
    sns: {
      region: process.env.AWS_SNS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY,
    },
  },

  // Push notification configuration
  push: {
    provider: process.env.PUSH_PROVIDER || 'firebase', // 'firebase', 'onesignal'
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    onesignal: {
      appId: process.env.ONESIGNAL_APP_ID,
      restApiKey: process.env.ONESIGNAL_REST_API_KEY,
    },
  },

  // Template configuration
  templates: {
    emailPath: process.env.EMAIL_TEMPLATES_PATH || './templates/email',
    smsPath: process.env.SMS_TEMPLATES_PATH || './templates/sms',
  },

  // Queue configuration for async notifications
  queue: {
    enabled: process.env.NOTIFICATION_QUEUE_ENABLED === 'true',
    concurrency: parseInt(process.env.NOTIFICATION_QUEUE_CONCURRENCY || '5', 10),
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  },

  // Rate limiting
  rateLimit: {
    emailPerHour: parseInt(process.env.EMAIL_RATE_LIMIT_PER_HOUR || '50', 10),
    smsPerHour: parseInt(process.env.SMS_RATE_LIMIT_PER_HOUR || '20', 10),
    pushPerHour: parseInt(process.env.PUSH_RATE_LIMIT_PER_HOUR || '100', 10),
  },

  // Retry configuration
  retry: {
    attempts: parseInt(process.env.NOTIFICATION_RETRY_ATTEMPTS || '3', 10),
    delay: parseInt(process.env.NOTIFICATION_RETRY_DELAY || '5000', 10), // 5 seconds
    backoff: process.env.NOTIFICATION_RETRY_BACKOFF || 'exponential',
  },
}));
