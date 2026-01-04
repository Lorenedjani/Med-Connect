export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum DoctorVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
}

export const ROLE_HIERARCHY = {
  [UserRole.PATIENT]: 1,
  [UserRole.DOCTOR]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};

export const ROLE_PERMISSIONS = {
  [UserRole.PATIENT]: [
    'read_own_profile',
    'update_own_profile',
    'upload_medical_records',
    'view_own_records',
    'share_records',
    'request_consent',
    'view_consent_requests',
    'send_messages',
    'book_appointments',
    'view_own_appointments',
  ],
  [UserRole.DOCTOR]: [
    'read_own_profile',
    'update_own_profile',
    'upload_medical_records',
    'view_own_records',
    'view_shared_records',
    'grant_consent',
    'revoke_consent',
    'send_messages',
    'manage_schedule',
    'view_appointments',
    'complete_appointments',
    'access_patient_history',
  ],
  [UserRole.ADMIN]: [
    'read_all_profiles',
    'update_all_profiles',
    'verify_doctors',
    'suspend_users',
    'view_all_records',
    'view_system_logs',
    'manage_notifications',
    'view_analytics',
    'system_configuration',
  ],
  [UserRole.SUPER_ADMIN]: [
    'all_admin_permissions',
    'delete_users',
    'delete_records',
    'system_maintenance',
    'access_all_data',
  ],
};

