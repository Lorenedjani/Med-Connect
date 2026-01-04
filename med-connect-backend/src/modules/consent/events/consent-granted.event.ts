export class ConsentGrantedEvent {
  constructor(
    public readonly consentId: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly permission: string,
    public readonly grantedById: string,
    public readonly recordIds?: string[],
  ) {}
}