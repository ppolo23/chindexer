import { Controller, Get, Param } from '@nestjs/common';
import { GetTotalAmountUseCase } from 'src/transaction/application/get-total-amount/get-total-amount.use-case';
import { IsChilizTransactionUseCase } from 'src/transaction/application/is-chiliz-transaction/is-chiliz-transaction.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly isChilizTransactionUseCase: IsChilizTransactionUseCase,
    private readonly getTotalAmountUseCase: GetTotalAmountUseCase,
  ) {}

  @Get(':hash')
  async getIsChilizTransaction(@Param('hash') hash: string): Promise<boolean> {
    return await this.isChilizTransactionUseCase.execute(hash);
  }

  @Get()
  async getTotalAmount(): Promise<number> {
    return await this.getTotalAmountUseCase.execute();
  }
}
