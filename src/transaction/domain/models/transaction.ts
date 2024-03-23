export class Transaction {
  readonly hash: string;
  readonly from: string;
  readonly to: string;
  readonly block: number;
  readonly value: number;

  constructor(
    hash: string,
    from: string,
    to: string,
    block: number,
    value: number,
  ) {
    this.hash = hash;
    this.from = from;
    this.to = to;
    this.block = block;
    this.value = value;
  }
}
