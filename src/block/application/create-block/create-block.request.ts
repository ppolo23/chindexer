export class CreateBlockRequest {
  constructor(
    readonly blockHash: string,
    readonly blockNumber: number,
    readonly blockTimestamp: bigint,
  ) {}
}
