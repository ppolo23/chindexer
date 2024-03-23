import { Transaction } from '../models/transaction';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findOneByHash(hash: string): Promise<Transaction>;
  getTotalAmount(): Promise<number>;
}
