export enum RecordCategory {
  LAB_RESULTS = 'lab_results',
  IMAGING = 'imaging',
  PRESCRIPTIONS = 'prescriptions',
  DOCTOR_NOTES = 'doctor_notes',
  VITAL_SIGNS = 'vital_signs',
  ALLERGIES = 'allergies',
  MEDICATIONS = 'medications',
  SURGICAL_HISTORY = 'surgical_history',
  FAMILY_HISTORY = 'family_history',
  IMMUNIZATIONS = 'immunizations',
  INSURANCE = 'insurance',
  OTHER = 'other',
}

export enum RecordType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  PDF = 'pdf',
  TEXT = 'text',
}

export const RECORD_CATEGORY_LABELS = {
  [RecordCategory.LAB_RESULTS]: 'Lab Results',
  [RecordCategory.IMAGING]: 'Imaging & Radiology',
  [RecordCategory.PRESCRIPTIONS]: 'Prescriptions',
  [RecordCategory.DOCTOR_NOTES]: 'Doctor Notes',
  [RecordCategory.VITAL_SIGNS]: 'Vital Signs',
  [RecordCategory.ALLERGIES]: 'Allergies',
  [RecordCategory.MEDICATIONS]: 'Medications',
  [RecordCategory.SURGICAL_HISTORY]: 'Surgical History',
  [RecordCategory.FAMILY_HISTORY]: 'Family History',
  [RecordCategory.IMMUNIZATIONS]: 'Immunizations',
  [RecordCategory.INSURANCE]: 'Insurance Documents',
  [RecordCategory.OTHER]: 'Other',
};

export const RECORD_TYPE_EXTENSIONS = {
  [RecordType.DOCUMENT]: ['.doc', '.docx', '.txt', '.rtf'],
  [RecordType.IMAGE]: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'],
  [RecordType.PDF]: ['.pdf'],
  [RecordType.TEXT]: ['.txt', '.md'],
};

export const RECORD_ACCESS_LEVELS = {
  OWNER_ONLY: 'owner_only',
  SHARED_WITH_DOCTORS: 'shared_with_doctors',
  PUBLIC: 'public',
} as const;

export type RecordAccessLevel = typeof RECORD_ACCESS_LEVELS[keyof typeof RECORD_ACCESS_LEVELS];

