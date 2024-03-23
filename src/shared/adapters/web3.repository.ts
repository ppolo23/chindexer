import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockchainRepository } from 'src/shared/ports/blockchain.repository';
import Web3, { Block, DecodedParams, Log, TransactionReceipt } from 'web3';

@Injectable()
export class Web3Repository implements BlockchainRepository {
  private web3: Web3;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    const providerURL = this.configService.get<string>('ETHEREUM_URL');
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(`${providerURL}${apiKey}`),
    );
  }

  async getBlock(hash: string): Promise<Block> {
    return await this.web3.eth.getBlock(hash, true);
  }

  decodeTransferLog(log: Log): DecodedParams {
    return this.web3.eth.abi.decodeLog(
      [
        {
          type: 'address',
          name: 'from',
          indexed: true,
        },
        {
          type: 'address',
          name: 'to',
          indexed: true,
        },
        {
          type: 'uint256',
          name: 'value',
          indexed: false,
        },
      ],
      log.data as string,
      log.topics as string[],
    );
  }

  async getTransactionReceipt(
    transactionhash: string,
  ): Promise<TransactionReceipt> {
    return await this.web3.eth.getTransactionReceipt(transactionhash);
  }
}
