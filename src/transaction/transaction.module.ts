import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './infrastructure/api/transaction.controller';
import { CreateChilizTransactionUseCase } from './application/create-chiliz-transaction/create-chiliz-transaction.use-case';
import { FindChilizTransactionsUseCase } from './application/find-chiliz-transactions-in-block/find-chiliz-transactions.use-case';
import { GetTotalAmountUseCase } from './application/get-total-amount/get-total-amount.use-case';
import { IsChilizTransactionUseCase } from './application/is-chiliz-transaction/is-chiliz-transaction.use-case';
import { TransactionFoundListener } from './infrastructure/listeners/transaction-found.listener';
import {
  TransactionEntity,
  TransactionEntitySchema,
} from './infrastructure/repositories/entities/transaction.entity';
import { TransactionMongooseRepository } from './infrastructure/repositories/transaction-mongoose.repository';
import { BlockCreatedListener } from './infrastructure/listeners/block-created.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionEntity.name, schema: TransactionEntitySchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    BlockCreatedListener,
    TransactionFoundListener,
    FindChilizTransactionsUseCase,
    CreateChilizTransactionUseCase,
    IsChilizTransactionUseCase,
    GetTotalAmountUseCase,
    {
      provide: 'TransactionRepository',
      useClass: TransactionMongooseRepository,
    },
  ],
})
export class TransactionModule {}
