import { 
  Patient, 
  Doctor, 
  MedicalRecord, 
  Connection, 
  ConsentPermission, 
  AccessLog, 
  Message, 
  Notification,
  Appointment,
  SystemStats,
  AuditLog
} from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'patient-1',
    email: 'patient@demo.com',
    role: 'patient',
    fullName: 'John Patient',
    phone: '+1234567890',
    dateOfBirth: '1990-05-15',
    nationalId: 'NAT123456',
    createdAt: '2024-01-15T10:00:00Z',
    is2FAEnabled: false,
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 'patient-2',
    email: 'jane.doe@demo.com',
    role: 'patient',
    fullName: 'Jane Doe',
    phone: '+1234567893',
    dateOfBirth: '1985-08-22',
    nationalId: 'NAT789012',
    createdAt: '2024-02-01T10:00:00Z',
    is2FAEnabled: true,
    bloodType: 'A+',
    allergies: [],
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doctor-1',
    email: 'doctor@demo.com',
    role: 'doctor',
    fullName: 'Dr. Sarah Smith',
    phone: '+1234567891',
    createdAt: '2024-01-10T10:00:00Z',
    is2FAEnabled: false,
    medicalLicenseNumber: 'MED123456',
    specialization: 'Cardiology',
    affiliatedInstitutions: ['City General Hospital', 'Medical Center'],
    verificationStatus: 'verified',
    bio: 'Experienced cardiologist with 15 years of practice.',
    experienceYears: 15,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'doctor-2',
    email: 'dr.johnson@demo.com',
    role: 'doctor',
    fullName: 'Dr. Michael Johnson',
    phone: '+1234567894',
    createdAt: '2024-01-20T10:00:00Z',
    is2FAEnabled: true,
    medicalLicenseNumber: 'MED789012',
    specialization: 'Neurology',
    affiliatedInstitutions: ['University Hospital'],
    verificationStatus: 'verified',
    bio: 'Board-certified neurologist specializing in migraine treatment.',
    experienceYears: 10,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  {
    id: 'doctor-3',
    email: 'dr.pending@demo.com',
    role: 'doctor',
    fullName: 'Dr. Emily Chen',
    phone: '+1234567895',
    createdAt: '2026-01-02T10:00:00Z',
    is2FAEnabled: false,
    medicalLicenseNumber: 'MED345678',
    specialization: 'Dermatology',
    affiliatedInstitutions: ['Skin Care Clinic'],
    verificationStatus: 'pending',
    bio: 'Dermatologist with focus on cosmetic procedures.',
    experienceYears: 5,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  }
];

export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'record-1',
    patientId: 'patient-1',
    title: 'Blood Test Results',
    category: 'laboratory_results',
    dateOfIssue: '2025-12-15',
    issuingFacility: 'City Lab',
    issuingDoctor: 'Dr. Sarah Smith',
    fileUrl: '/mock/blood-test.pdf',
    fileType: 'pdf',
    fileSize: 245000,
    uploadedAt: '2025-12-16T10:00:00Z',
    isEncrypted: true
  },
  {
    id: 'record-2',
    patientId: 'patient-1',
    title: 'Prescription - Blood Pressure Medication',
    category: 'prescriptions',
    dateOfIssue: '2025-12-20',
    issuingFacility: 'City General Hospital',
    issuingDoctor: 'Dr. Sarah Smith',
    fileUrl: '/mock/prescription.pdf',
    fileType: 'pdf',
    fileSize: 120000,
    uploadedAt: '2025-12-20T14:30:00Z',
    isEncrypted: true
  },
  {
    id: 'record-3',
    patientId: 'patient-1',
    title: 'Chest X-Ray',
    category: 'medical_imaging',
    dateOfIssue: '2025-11-10',
    issuingFacility: 'Medical Imaging Center',
    fileUrl: '/mock/xray.jpg',
    fileType: 'jpg',
    fileSize: 850000,
    uploadedAt: '2025-11-12T09:00:00Z',
    isEncrypted: true
  },
  {
    id: 'record-4',
    patientId: 'patient-1',
    title: 'COVID-19 Vaccination Card',
    category: 'vaccination_records',
    dateOfIssue: '2024-03-01',
    issuingFacility: 'Public Health Center',
    fileUrl: '/mock/vaccine.pdf',
    fileType: 'pdf',
    fileSize: 180000,
    uploadedAt: '2024-03-02T11:00:00Z',
    isEncrypted: true
  },
  {
    id: 'record-5',
    patientId: 'patient-1',
    title: 'Annual Checkup Notes',
    category: 'doctors_notes',
    dateOfIssue: '2025-10-05',
    issuingFacility: 'City General Hospital',
    issuingDoctor: 'Dr. Sarah Smith',
    fileUrl: '/mock/checkup.pdf',
    fileType: 'pdf',
    fileSize: 95000,
    uploadedAt: '2025-10-06T15:20:00Z',
    isEncrypted: true
  }
];

export const MOCK_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    status: 'connected',
    requestedAt: '2025-11-01T10:00:00Z',
    acceptedAt: '2025-11-01T14:30:00Z'
  },
  {
    id: 'conn-2',
    patientId: 'patient-1',
    doctorId: 'doctor-2',
    status: 'pending',
    requestedAt: '2026-01-02T09:00:00Z'
  },
  {
    id: 'conn-3',
    patientId: 'patient-2',
    doctorId: 'doctor-1',
    status: 'connected',
    requestedAt: '2025-12-10T11:00:00Z',
    acceptedAt: '2025-12-10T12:00:00Z'
  }
];

export const MOCK_CONSENT_PERMISSIONS: ConsentPermission[] = [
  {
    id: 'consent-1',
    connectionId: 'conn-1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    recordIds: ['record-1', 'record-2', 'record-5'],
    categories: [],
    createdAt: '2025-11-01T15:00:00Z'
  }
];

export const MOCK_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-1',
    recordId: 'record-1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    accessedAt: '2025-12-16T16:00:00Z',
    ipAddress: '192.168.1.100',
    action: 'view'
  },
  {
    id: 'log-2',
    recordId: 'record-2',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    accessedAt: '2025-12-21T10:30:00Z',
    ipAddress: '192.168.1.100',
    action: 'view'
  },
  {
    id: 'log-3',
    recordId: 'record-5',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    accessedAt: '2025-12-28T14:15:00Z',
    ipAddress: '192.168.1.100',
    action: 'download'
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderId: 'patient-1',
    receiverId: 'doctor-1',
    content: 'Hello Dr. Smith, I have a question about my medication.',
    sentAt: '2026-01-02T09:00:00Z',
    readAt: '2026-01-02T09:15:00Z',
    isEncrypted: true
  },
  {
    id: 'msg-2',
    senderId: 'doctor-1',
    receiverId: 'patient-1',
    content: 'Hi John, of course! What would you like to know?',
    sentAt: '2026-01-02T09:15:00Z',
    readAt: '2026-01-02T09:20:00Z',
    isEncrypted: true
  },
  {
    id: 'msg-3',
    senderId: 'patient-1',
    receiverId: 'doctor-1',
    content: 'Should I take the medication before or after meals?',
    sentAt: '2026-01-02T09:20:00Z',
    readAt: '2026-01-02T09:25:00Z',
    isEncrypted: true
  },
  {
    id: 'msg-4',
    senderId: 'doctor-1',
    receiverId: 'patient-1',
    content: 'Please take it after meals, twice daily. Let me know if you experience any side effects.',
    sentAt: '2026-01-02T09:25:00Z',
    isEncrypted: true
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    scheduledAt: '2026-01-10T14:00:00Z',
    duration: 30,
    type: 'video',
    status: 'scheduled',
    reason: 'Follow-up consultation',
    createdAt: '2026-01-02T10:00:00Z'
  },
  {
    id: 'appt-2',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    scheduledAt: '2025-12-20T10:00:00Z',
    duration: 45,
    type: 'in_person',
    status: 'completed',
    reason: 'Annual checkup',
    notes: 'Patient is in good health. Continue current medication.',
    createdAt: '2025-12-10T11:00:00Z'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'patient-1',
    type: 'connection_accepted',
    title: 'Connection Accepted',
    message: 'Dr. Sarah Smith has accepted your connection request.',
    isRead: false,
    createdAt: '2025-11-01T14:30:00Z'
  },
  {
    id: 'notif-2',
    userId: 'patient-1',
    type: 'new_message',
    title: 'New Message',
    message: 'You have a new message from Dr. Sarah Smith.',
    isRead: false,
    createdAt: '2026-01-02T09:25:00Z'
  },
  {
    id: 'notif-3',
    userId: 'patient-1',
    type: 'appointment_reminder',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Sarah Smith is tomorrow at 2:00 PM.',
    isRead: true,
    createdAt: '2026-01-09T09:00:00Z'
  },
  {
    id: 'notif-4',
    userId: 'doctor-1',
    type: 'connection_request',
    title: 'New Connection Request',
    message: 'John Patient has sent you a connection request.',
    isRead: true,
    createdAt: '2025-11-01T10:00:00Z'
  }
];

export const MOCK_SYSTEM_STATS: SystemStats = {
  totalUsers: 152,
  totalPatients: 120,
  totalDoctors: 28,
  pendingVerifications: 4,
  totalRecords: 1847,
  storageUsed: 2547483648, // ~2.5 GB
  activeConnections: 89
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'doctor-1',
    action: 'view_medical_record',
    resourceType: 'medical_record',
    resourceId: 'record-1',
    timestamp: '2025-12-16T16:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    details: { recordTitle: 'Blood Test Results', patientId: 'patient-1' }
  },
  {
    id: 'audit-2',
    userId: 'admin-1',
    action: 'verify_doctor',
    resourceType: 'doctor',
    resourceId: 'doctor-1',
    timestamp: '2024-01-11T10:00:00Z',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0...',
    details: { doctorName: 'Dr. Sarah Smith', licenseNumber: 'MED123456' }
  },
  {
    id: 'audit-3',
    userId: 'patient-1',
    action: 'upload_medical_record',
    resourceType: 'medical_record',
    resourceId: 'record-1',
    timestamp: '2025-12-16T10:00:00Z',
    ipAddress: '192.168.1.25',
    userAgent: 'Mozilla/5.0...',
    details: { recordTitle: 'Blood Test Results', category: 'laboratory_results' }
  }
];
