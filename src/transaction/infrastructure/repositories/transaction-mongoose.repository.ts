import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';
import { Transaction } from 'src/transaction/domain/models/transaction';

export class TransactionMongooseRepository implements TransactionRepository {
  constructor(
    @InjectModel(TransactionEntity.name)
    private readonly transactionModel: Model<TransactionEntity>,
  ) {}

  async save(transaciton: Transaction): Promise<Transaction> {
    const entity = new this.transactionModel();
    entity.hash = transaciton.hash;
    entity.from = transaciton.from;
    entity.to = transaciton.to;
    entity.block = transaciton.block;
    entity.value = transaciton.value;
    const savedEntity = await entity.save();
    return new Transaction(
      savedEntity.hash,
      savedEntity.from,
      savedEntity.to,
      savedEntity.block,
      savedEntity.value,
    );
  }

  async findOneByHash(hash: string): Promise<Transaction> {
    const entity = await this.transactionModel.findOne({
      hash: hash,
    });
    if (entity) {
      return new Transaction(
        entity.hash,
        entity.from,
        entity.to,
        entity.block,
        entity.value,
      );
    } else {
      return null;
    }
  }

  async getTotalAmount(): Promise<number> {
    const amount = await this.transactionModel.aggregate([
      { $group: { _id: null, amount: { $sum: '$value' } } },
    ]);
    return amount.length > 0 ? amount[0].amount : 0;
  }
}
