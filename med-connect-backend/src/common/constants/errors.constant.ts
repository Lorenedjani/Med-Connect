export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  OTP_EXPIRED = 'OTP_EXPIRED',
  OTP_INVALID = 'OTP_INVALID',

  // User Management
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
  DOCTOR_NOT_VERIFIED = 'DOCTOR_NOT_VERIFIED',
  INVALID_USER_ROLE = 'INVALID_USER_ROLE',

  // Medical Records
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  RECORD_ACCESS_DENIED = 'RECORD_ACCESS_DENIED',
  RECORD_ALREADY_EXISTS = 'RECORD_ALREADY_EXISTS',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',

  // Consent & Sharing
  CONSENT_NOT_FOUND = 'CONSENT_NOT_FOUND',
  CONSENT_ALREADY_EXISTS = 'CONSENT_ALREADY_EXISTS',
  CONSENT_ACCESS_DENIED = 'CONSENT_ACCESS_DENIED',
  CONNECTION_NOT_FOUND = 'CONNECTION_NOT_FOUND',
  CONNECTION_ALREADY_EXISTS = 'CONNECTION_ALREADY_EXISTS',

  // Appointments
  APPOINTMENT_NOT_FOUND = 'APPOINTMENT_NOT_FOUND',
  APPOINTMENT_CONFLICT = 'APPOINTMENT_CONFLICT',
  APPOINTMENT_CANNOT_CANCEL = 'APPOINTMENT_CANNOT_CANCEL',
  APPOINTMENT_CANNOT_RESCHEDULE = 'APPOINTMENT_CANNOT_RESCHEDULE',
  SLOT_NOT_AVAILABLE = 'SLOT_NOT_AVAILABLE',

  // Communications
  MESSAGE_NOT_FOUND = 'MESSAGE_NOT_FOUND',
  CONVERSATION_NOT_FOUND = 'CONVERSATION_NOT_FOUND',
  INVALID_PARTICIPANT = 'INVALID_PARTICIPANT',

  // Video Calls
  VIDEO_CALL_NOT_FOUND = 'VIDEO_CALL_NOT_FOUND',
  VIDEO_CALL_FULL = 'VIDEO_CALL_FULL',
  VIDEO_CALL_ENDED = 'VIDEO_CALL_ENDED',

  // General
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // External Services
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  SMS_SEND_FAILED = 'SMS_SEND_FAILED',
  STORAGE_UPLOAD_FAILED = 'STORAGE_UPLOAD_FAILED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export const ERROR_MESSAGES = {
  [ErrorCode.UNAUTHORIZED]: 'Authentication required',
  [ErrorCode.FORBIDDEN]: 'Access denied',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCode.TOKEN_EXPIRED]: 'Token has expired',
  [ErrorCode.TOKEN_INVALID]: 'Invalid token',
  [ErrorCode.OTP_EXPIRED]: 'OTP has expired',
  [ErrorCode.OTP_INVALID]: 'Invalid OTP',

  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists',
  [ErrorCode.USER_NOT_VERIFIED]: 'User account not verified',
  [ErrorCode.DOCTOR_NOT_VERIFIED]: 'Doctor account not verified',
  [ErrorCode.INVALID_USER_ROLE]: 'Invalid user role',

  [ErrorCode.RECORD_NOT_FOUND]: 'Medical record not found',
  [ErrorCode.RECORD_ACCESS_DENIED]: 'Access denied to this record',
  [ErrorCode.RECORD_ALREADY_EXISTS]: 'Record already exists',
  [ErrorCode.INVALID_FILE_TYPE]: 'Invalid file type',
  [ErrorCode.FILE_TOO_LARGE]: 'File size exceeds limit',
  [ErrorCode.FILE_UPLOAD_FAILED]: 'File upload failed',

  [ErrorCode.CONSENT_NOT_FOUND]: 'Consent record not found',
  [ErrorCode.CONSENT_ALREADY_EXISTS]: 'Consent already exists',
  [ErrorCode.CONSENT_ACCESS_DENIED]: 'Access denied to consent',
  [ErrorCode.CONNECTION_NOT_FOUND]: 'Connection not found',
  [ErrorCode.CONNECTION_ALREADY_EXISTS]: 'Connection already exists',

  [ErrorCode.APPOINTMENT_NOT_FOUND]: 'Appointment not found',
  [ErrorCode.APPOINTMENT_CONFLICT]: 'Appointment conflicts with existing schedule',
  [ErrorCode.APPOINTMENT_CANNOT_CANCEL]: 'Appointment cannot be cancelled at this time',
  [ErrorCode.APPOINTMENT_CANNOT_RESCHEDULE]: 'Appointment cannot be rescheduled',
  [ErrorCode.SLOT_NOT_AVAILABLE]: 'Time slot not available',

  [ErrorCode.MESSAGE_NOT_FOUND]: 'Message not found',
  [ErrorCode.CONVERSATION_NOT_FOUND]: 'Conversation not found',
  [ErrorCode.INVALID_PARTICIPANT]: 'Invalid conversation participant',

  [ErrorCode.VIDEO_CALL_NOT_FOUND]: 'Video call not found',
  [ErrorCode.VIDEO_CALL_FULL]: 'Video call is full',
  [ErrorCode.VIDEO_CALL_ENDED]: 'Video call has ended',

  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.BAD_REQUEST]: 'Bad request',
  [ErrorCode.NOT_FOUND]: 'Resource not found',
  [ErrorCode.CONFLICT]: 'Resource conflict',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',

  [ErrorCode.EMAIL_SEND_FAILED]: 'Failed to send email',
  [ErrorCode.SMS_SEND_FAILED]: 'Failed to send SMS',
  [ErrorCode.STORAGE_UPLOAD_FAILED]: 'Failed to upload file',
  [ErrorCode.PAYMENT_FAILED]: 'Payment processing failed',
};

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

