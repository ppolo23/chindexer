import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';
import { BlockchainRepository } from 'src/shared/ports/blockchain.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FindChilizTransactionsUseCase } from 'src/transaction/application/find-chiliz-transactions-in-block/find-chiliz-transactions.use-case';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { createWeb3Block } from 'test/utils/test-utils';

describe('FindChilizTransactionsUseCase', () => {
  let useCase: FindChilizTransactionsUseCase;
  const configServiceMock = createMock<ConfigService>;
  const transactionRepositoryMock = createMock<TransactionRepository>();
  const blockchainRepositoryMock = createMock<BlockchainRepository>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), EventEmitterModule.forRoot()],
      providers: [
        FindChilizTransactionsUseCase,
        {
          provide: 'ConfigService',
          useValue: configServiceMock,
        },
        {
          provide: 'TransactionRepository',
          useValue: transactionRepositoryMock,
        },
        {
          provide: 'BlockchainRepository',
          useValue: blockchainRepositoryMock,
        },
      ],
    }).compile();

    useCase = app.get<FindChilizTransactionsUseCase>(
      FindChilizTransactionsUseCase,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Execute', () => {
    it('should create a chiliz transaction', async () => {
      const chilizTransactionHash = 'chilizTransactionHash';
      const chilizContract = '0x3506424f91fd33084466f402d5d97f05f8e3b4af';
      const block = createWeb3Block(chilizTransactionHash, chilizContract);
      blockchainRepositoryMock.getBlock.mockResolvedValue(block);

      await useCase.execute('blockHash');

      expect(blockchainRepositoryMock.getBlock).toHaveBeenCalledTimes(1);
    });
  });
});
