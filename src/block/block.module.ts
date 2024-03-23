import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlockEntity,
  BlockEntitySchema,
} from './infrastructure/repositories/entities/block.entity';
import { CreateBlockUseCase } from './application/create-block/create-block.use-case';
import { BlockMongooseRepository } from './infrastructure/repositories/block-mongoose.repository';
import { BlockHeaderReceivedListener } from './infrastructure/listeners/block-header-received.listener';
import { Web3BlockSubscriptionAdaptor } from './infrastructure/web3-block-subscription.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlockEntity.name, schema: BlockEntitySchema },
    ]),
  ],
  providers: [
    Web3BlockSubscriptionAdaptor,
    BlockHeaderReceivedListener,
    CreateBlockUseCase,
    {
      provide: 'BlockRepository',
      useClass: BlockMongooseRepository,
    },
  ],
})
export class BlockModule {}
