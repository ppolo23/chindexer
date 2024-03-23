import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockchainRepository } from 'src/shared/ports/blockchain.repository';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';

@Injectable()
export class IsChilizTransactionUseCase {
  constructor(
    private configService: ConfigService,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject('BlockchainRepository')
    private readonly blockchainRepository: BlockchainRepository,
  ) {}

  async execute(hash: string): Promise<boolean> {
    return (
      (await this.isTransactionInDb(hash)) ||
      (await this.isTransactionInBlockchain(hash))
    );
  }

  async isTransactionInDb(hash: string): Promise<boolean> {
    const transaction = await this.transactionRepository.findOneByHash(hash);
    return transaction != null;
  }

  async isTransactionInBlockchain(hash: string): Promise<boolean> {
    try {
      const transactionReceipt =
        await this.blockchainRepository.getTransactionReceipt(hash);
      return (
        transactionReceipt.to === this.configService.get<string>('CHZ_TOKEN')
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
