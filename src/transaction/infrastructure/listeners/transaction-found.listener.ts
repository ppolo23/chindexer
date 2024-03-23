import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionFoundEvent } from '../../domain/events/transaction-found.event';
import { CreateChilizTransactionUseCase } from '../../application/create-chiliz-transaction/create-chiliz-transaction.use-case';

@Injectable()
export class TransactionFoundListener {
  constructor(private readonly useCase: CreateChilizTransactionUseCase) {}

  @OnEvent(TransactionFoundEvent.EVENT_NAME)
  handleEvent(event: TransactionFoundEvent) {
    this.useCase.execute(event.trxHash);
  }
}
