export class RecordAccessedEvent {
  constructor(
    public readonly recordId: string,
    public readonly userId: string,
    public readonly action: string,
    public readonly result: string,
    public readonly consentId?: string,
    public readonly metadata?: any,
  ) {}
}