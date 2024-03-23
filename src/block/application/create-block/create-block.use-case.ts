import { Inject, Injectable } from '@nestjs/common';
import { Block } from '../../domain/models/block';
import { CreateBlockRequest } from './create-block.request';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BlockRepository } from 'src/block/domain/ports/block.repository';
import { BlockCreatedEvent } from 'src/block/domain/events/block-created.event';

@Injectable()
export class CreateBlockUseCase {
  constructor(
    @Inject('BlockRepository')
    private readonly blockRepository: BlockRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(request: CreateBlockRequest): Promise<Block> {
    const savedBlock = await this.blockRepository.save(
      new Block(
        request.blockHash,
        Number(request.blockNumber),
        new Date(Number(request.blockTimestamp) * 1000),
      ),
    );

    this.eventEmitter.emit(
      BlockCreatedEvent.EVENT_NAME,
      new BlockCreatedEvent(savedBlock.hash, savedBlock.number),
    );

    return savedBlock;
  }
}
