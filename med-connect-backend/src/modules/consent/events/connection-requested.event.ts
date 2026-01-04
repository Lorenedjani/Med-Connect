export class ConnectionRequestedEvent {
  constructor(
    public readonly connectionId: string,
    public readonly requesterId: string,
    public readonly targetId: string,
    public readonly type: string,
    public readonly message?: string,
  ) {}
}