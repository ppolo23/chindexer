export class BlockHeaderReceivedEvent {
  static EVENT_NAME = 'blockHeader.received';

  constructor(
    readonly bockHash: string,
    readonly blockNumber: number,
    readonly blockTimestamp: bigint,
  ) {}
}
