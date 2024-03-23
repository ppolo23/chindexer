import { Global, Module } from '@nestjs/common';
import { Web3Repository } from './adapters/web3.repository';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'BlockchainRepository',
      useClass: Web3Repository,
    },
  ],
  exports: [
    {
      provide: 'BlockchainRepository',
      useClass: Web3Repository,
    },
  ],
})
export class SharedModule {}
