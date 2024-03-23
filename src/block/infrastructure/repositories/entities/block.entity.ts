import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlockDocument = HydratedDocument<BlockEntity>;

@Schema({ collection: 'blocks', timestamps: true })
export class BlockEntity {
  @Prop()
  hash: string;

  @Prop()
  number: number;

  @Prop()
  timestamp: Date;
}

export const BlockEntitySchema = SchemaFactory.createForClass(BlockEntity);
