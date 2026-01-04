export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  TELECONSULTATION = 'teleconsultation',
  IN_PERSON = 'in_person',
}

export const APPOINTMENT_STATUS_TRANSITIONS = {
  [AppointmentStatus.SCHEDULED]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED, AppointmentStatus.RESCHEDULED],
  [AppointmentStatus.CONFIRMED]: [AppointmentStatus.IN_PROGRESS, AppointmentStatus.CANCELLED, AppointmentStatus.RESCHEDULED, AppointmentStatus.NO_SHOW],
  [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
  [AppointmentStatus.COMPLETED]: [],
  [AppointmentStatus.CANCELLED]: [],
  [AppointmentStatus.NO_SHOW]: [],
  [AppointmentStatus.RESCHEDULED]: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED],
};

export const APPOINTMENT_CANCELLATION_REASONS = [
  'patient_request',
  'doctor_unavailable',
  'emergency',
  'weather_conditions',
  'technical_issues',
  'other',
];

export const APPOINTMENT_REMINDER_TIMINGS = [
  24 * 60 * 60, // 24 hours
  2 * 60 * 60,  // 2 hours
  30 * 60,      // 30 minutes
  15 * 60,      // 15 minutes
];

