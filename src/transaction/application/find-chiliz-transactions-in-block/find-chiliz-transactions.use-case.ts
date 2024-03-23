import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransactionFoundEvent } from '../../domain/events/transaction-found.event';
import { ConfigService } from '@nestjs/config';
import { BlockchainRepository } from 'src/shared/ports/blockchain.repository';

@Injectable()
export class FindChilizTransactionsUseCase {
  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @Inject('BlockchainRepository')
    private blockchainRepository: BlockchainRepository,
  ) {}

  async execute(blockHash: string): Promise<void> {
    const block = await this.blockchainRepository.getBlock(blockHash);
    if (block?.transactions && block.transactions.length > 0) {
      for (const transaction of block.transactions) {
        if (this.isChilizTransaction(transaction['to'])) {
          this.eventEmitter.emit(
            TransactionFoundEvent.EVENT_NAME,
            new TransactionFoundEvent(transaction['hash']),
          );
        }
      }
    }
  }

  private isChilizTransaction(to: string): boolean {
    return to === this.configService.get<string>('CHZ_TOKEN');
  }
}
