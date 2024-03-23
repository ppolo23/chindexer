import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateBlockRequest } from 'src/block/application/create-block/create-block.request';
import { CreateBlockUseCase } from 'src/block/application/create-block/create-block.use-case';
import { BlockHeaderReceivedEvent } from 'src/block/domain/events/new-block-header.event';

@Injectable()
export class BlockHeaderReceivedListener {
  constructor(private readonly createBlockUseCase: CreateBlockUseCase) {}

  @OnEvent(BlockHeaderReceivedEvent.EVENT_NAME)
  handleEvent(event: BlockHeaderReceivedEvent) {
    this.createBlockUseCase.execute(
      new CreateBlockRequest(
        event.bockHash,
        event.blockNumber,
        event.blockTimestamp,
      ),
    );
  }
}
