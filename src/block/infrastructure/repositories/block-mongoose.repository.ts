import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockEntity } from './entities/block.entity';
import { BlockRepository } from 'src/block/domain/ports/block.repository';
import { Block } from 'src/block/domain/models/block';

export class BlockMongooseRepository implements BlockRepository {
  constructor(
    @InjectModel(BlockEntity.name)
    private readonly blockModel: Model<BlockEntity>,
  ) {}

  async save(block: Block): Promise<Block> {
    const entity = new this.blockModel();
    entity.hash = block.hash;
    entity.number = block.number;
    entity.timestamp = block.tiemstamp;
    const savedEntity = await entity.save();
    return new Block(
      savedEntity.hash,
      savedEntity.number,
      savedEntity.timestamp,
    );
  }

  async anyBlock(): Promise<boolean> {
    const blocks = await this.blockModel.find().exec();
    return blocks.length == 0;
  }

  async getLastBlockNumber(): Promise<number> {
    const blocks = await this.blockModel
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .exec();
    return blocks[0].number;
  }
}
