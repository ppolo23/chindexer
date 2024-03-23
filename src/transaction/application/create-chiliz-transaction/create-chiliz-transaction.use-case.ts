import { Inject, Injectable } from '@nestjs/common';
import Web3, { Log } from 'web3';
import { Transaction } from '../../domain/models/transaction';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';
import { ConfigService } from '@nestjs/config';
import { BlockchainRepository } from 'src/shared/ports/blockchain.repository';

@Injectable()
export class CreateChilizTransactionUseCase {
  TRANFER_SIGNATURE = 'Transfer(address,address,uint256)';

  constructor(
    private configService: ConfigService,
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject('BlockchainRepository')
    private readonly blockchainRepository: BlockchainRepository,
  ) {}

  async execute(transactionHash: string): Promise<void> {
    const transactionReceipt =
      await this.blockchainRepository.getTransactionReceipt(transactionHash);

    for (const log of transactionReceipt.logs) {
      if (this.isChilizTransfer(log)) {
        const decoded = this.blockchainRepository.decodeTransferLog(log);
        const transaction = new Transaction(
          transactionReceipt.transactionHash.toString(),
          decoded.from as string,
          decoded.to as string,
          Web3.utils.toNumber(transactionReceipt.blockNumber) as number,
          Number(Web3.utils.fromWei(decoded.value as bigint, 'ether')),
        );
        this.transactionRepository.save(transaction);
        console.log(
          `Transaction ${transaction.hash} from block ${transaction.block} created`,
        );
      }
    }
  }

  private isChilizTransfer(log: Log): boolean {
    const erc20TransferTopicHash = Web3.utils.keccak256(this.TRANFER_SIGNATURE);
    return (
      log.topics[0] === erc20TransferTopicHash &&
      log.address === this.configService.get<string>('CHZ_TOKEN')
    );
  }
}
