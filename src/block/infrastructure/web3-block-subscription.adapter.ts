import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import Web3 from 'web3';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { TransactionFoundEvent } from 'src/transaction/domain/events/transaction-found.event';
import { BlockRepository } from 'src/block/domain/ports/block.repository';
import { BlockHeaderReceivedEvent } from 'src/block/domain/events/new-block-header.event';

const NEW_BLOCK_HEADERS_EVENT = 'newBlockHeaders';

@Injectable()
export class Web3BlockSubscriptionAdaptor implements OnApplicationBootstrap {
  private web3: Web3;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @Inject('BlockRepository')
    private readonly blockRepository: BlockRepository,
  ) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    const providerURL = this.configService.get<string>('ETHEREUM_URL');
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(`${providerURL}${apiKey}`),
    );
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.retrivePastTransactions();
    await this.subscribeToNewBlocks();
  }

  private async retrivePastTransactions(): Promise<void> {
    if (await this.isFirstStart()) {
      const startBlock = this.configService.get<number>('START_BLOCK');
      if (startBlock != null) {
        await this.findTransactionsToLatestBlock(startBlock);
      }
    } else {
      const lastProcessBlock = await this.blockRepository.getLastBlockNumber();
      await this.findTransactionsToLatestBlock(lastProcessBlock);
    }
  }

  private async subscribeToNewBlocks() {
    try {
      const event = NEW_BLOCK_HEADERS_EVENT;
      const subscription = await this.web3.eth.subscribe(event);

      console.log(`Connected to ${event}, Subscription ID: ${subscription.id}`);

      subscription.on('data', (blockHeader) => {
        const now = new Date().toLocaleString();
        console.log(
          `${now} - New block mined: ${Web3.utils.toNumber(
            blockHeader.number,
          )}`,
        );
        const blockHeaderReceivedEvent = new BlockHeaderReceivedEvent(
          blockHeader.hash,
          blockHeader.number as number,
          blockHeader.timestamp as bigint,
        );
        this.eventEmitter.emit(
          BlockHeaderReceivedEvent.EVENT_NAME,
          blockHeaderReceivedEvent,
        );
      });
      subscription.on('error', (error) => {
        console.error('Error when subscribing to new block header:', error);
      });
    } catch (error) {
      console.error(`Error subscribing to new blocks: ${error}`);
    }
  }

  private async isFirstStart(): Promise<boolean> {
    return await this.blockRepository.anyBlock();
  }

  private async findTransactionsToLatestBlock(startBlock: number) {
    const options = {
      fromBlock: Web3.utils.numberToHex(startBlock),
      toBlock: 'latest',
      address: this.configService.get<string>('CHZ_TOKEN'),
    };
    const pastLogs = await this.web3.eth.getPastLogs(options);
    for (const log of pastLogs) {
      const transactionHash = log['transactionHash'];
      this.eventEmitter.emit(
        TransactionFoundEvent.EVENT_NAME,
        new TransactionFoundEvent(transactionHash),
      );
    }
  }
}
