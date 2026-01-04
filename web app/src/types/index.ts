// User Types
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  nationalId?: string;
  createdAt: string;
  is2FAEnabled: boolean;
  profileImage?: string;
}

export interface Patient extends User {
  role: 'patient';
  medicalHistory?: string;
  allergies?: string[];
  bloodType?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  medicalLicenseNumber: string;
  specialization: string;
  affiliatedInstitutions: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  bio?: string;
  experienceYears?: number;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: UserRole;
  dateOfBirth?: string;
  nationalId?: string;
  // Doctor-specific
  medicalLicenseNumber?: string;
  specialization?: string;
  affiliatedInstitutions?: string[];
}

// Medical Record Types
export type RecordCategory = 
  | 'laboratory_results'
  | 'prescriptions'
  | 'medical_imaging'
  | 'doctors_notes'
  | 'vaccination_records'
  | 'other';

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  category: RecordCategory;
  dateOfIssue: string;
  issuingFacility: string;
  issuingDoctor?: string;
  fileUrl: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileSize: number;
  uploadedAt: string;
  metadata?: Record<string, any>;
  isEncrypted: boolean;
}

// Connection & Consent Types
export type ConnectionStatus = 'pending' | 'connected' | 'rejected' | 'revoked';

export interface Connection {
  id: string;
  patientId: string;
  doctorId: string;
  status: ConnectionStatus;
  requestedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  revokedAt?: string;
  expiresAt?: string;
}

export interface ConsentPermission {
  id: string;
  connectionId: string;
  patientId: string;
  doctorId: string;
  recordIds: string[]; // Specific records shared, empty array means all
  categories: RecordCategory[]; // Categories shared, empty means all
  expiresAt?: string;
  createdAt: string;
  revokedAt?: string;
}

// Access Log Types
export interface AccessLog {
  id: string;
  recordId: string;
  patientId: string;
  doctorId: string;
  accessedAt: string;
  ipAddress: string;
  action: 'view' | 'download';
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  sentAt: string;
  readAt?: string;
  isEncrypted: boolean;
}

export interface Conversation {
  id: string;
  participantIds: [string, string];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  duration: number; // minutes
  type: 'in_person' | 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  createdAt: string;
}

// Notification Types
export type NotificationType = 
  | 'connection_request'
  | 'connection_accepted'
  | 'new_message'
  | 'record_accessed'
  | 'appointment_reminder'
  | 'verification_status';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Admin Types
export interface SystemStats {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
  pendingVerifications: number;
  totalRecords: number;
  storageUsed: number; // bytes
  activeConnections: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}
