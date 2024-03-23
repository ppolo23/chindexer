export class BlockCreatedEvent {
  static EVENT_NAME = 'block.created';

  constructor(readonly hash: string, readonly blockNumber: number) {}
}
