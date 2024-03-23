import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FindChilizTransactionsUseCase } from '../../application/find-chiliz-transactions-in-block/find-chiliz-transactions.use-case';
import { BlockCreatedEvent } from 'src/block/domain/events/block-created.event';

@Injectable()
export class BlockCreatedListener {
  constructor(private readonly useCase: FindChilizTransactionsUseCase) {}

  @OnEvent(BlockCreatedEvent.EVENT_NAME)
  handleEvent(event: BlockCreatedEvent) {
    this.useCase.execute(event.hash);
  }
}
