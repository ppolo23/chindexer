export class Block {
  constructor(
    readonly hash: string,
    readonly number: number,
    readonly tiemstamp: Date,
  ) {}
}
