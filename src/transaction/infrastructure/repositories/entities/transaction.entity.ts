import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<TransactionEntity>;

@Schema({ collection: 'transactions', timestamps: true })
export class TransactionEntity {
  @Prop()
  hash: string;
  @Prop()
  from: string;
  @Prop()
  to: string;
  @Prop()
  block: number;
  @Prop()
  value: number;
}

export const TransactionEntitySchema =
  SchemaFactory.createForClass(TransactionEntity);
