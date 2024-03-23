import { Block, Log, TransactionReceipt } from 'web3';

export interface BlockchainRepository {
  getBlock(hash: string): Promise<Block>;
  getTransactionReceipt(transactionhash: string): Promise<TransactionReceipt>;
  decodeTransferLog(log: Log): Record<string, unknown>;
}
