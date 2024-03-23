export class TransactionCreatedEvent {
  static EVENT_NAME = 'transaction.created';

  constructor(readonly trxHash: string) {}
}
