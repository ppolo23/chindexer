import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';

@Injectable()
export class GetTotalAmountUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(): Promise<number> {
    return await this.transactionRepository.getTotalAmount();
  }
}
