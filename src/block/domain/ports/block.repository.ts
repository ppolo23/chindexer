import { Block } from '../models/block';

export interface BlockRepository {
  save(block: Block): Promise<Block>;
  anyBlock(): Promise<boolean>;
  getLastBlockNumber(): Promise<number>;
}
