export class ConsentRevokedEvent {
  constructor(
    public readonly consentId: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly revokedById: string,
    public readonly reason?: string,
    public readonly recordIds?: string[],
  ) {}
}