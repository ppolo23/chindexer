export class TransactionFoundEvent {
  static EVENT_NAME = 'transaction.found';

  constructor(readonly trxHash: string) {}
}
