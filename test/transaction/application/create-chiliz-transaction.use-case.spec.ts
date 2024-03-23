import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { CreateChilizTransactionUseCase } from 'src/transaction/application/create-chiliz-transaction/create-chiliz-transaction.use-case';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';
import { BlockchainRepository } from 'src/shared/ports/blockchain.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from 'src/transaction/domain/models/transaction';
import {
  createDecodedLog,
  createTransactionReceiptToAddress,
} from 'test/utils/test-utils';

describe('CreateChilizTransactionUseCase', () => {
  let useCase: CreateChilizTransactionUseCase;
  const configServiceMock = createMock<ConfigService>;
  const transactionRepositoryMock = createMock<TransactionRepository>();
  const blockchainRepositoryMock = createMock<BlockchainRepository>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CreateChilizTransactionUseCase,
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

    useCase = app.get<CreateChilizTransactionUseCase>(
      CreateChilizTransactionUseCase,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Execute', () => {
    it('should create a chiliz transaction', async () => {
      const txReceipt = createTransactionReceiptToAddress(
        '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
      );
      const decodedParams = createDecodedLog();
      const transaction = new Transaction(
        txReceipt.transactionHash,
        decodedParams.from as string,
        decodedParams.to as string,
        txReceipt.blockNumber,
        decodedParams.value as number,
      );

      blockchainRepositoryMock.getTransactionReceipt.mockResolvedValue(
        txReceipt,
      );
      blockchainRepositoryMock.decodeTransferLog.mockReturnValueOnce(
        decodedParams,
      );
      transactionRepositoryMock.save.mockResolvedValue(transaction);

      await useCase.execute(txReceipt.transactionHash);
      expect(
        blockchainRepositoryMock.getTransactionReceipt,
      ).toHaveBeenCalledTimes(1);
      expect(blockchainRepositoryMock.decodeTransferLog).toHaveBeenCalledTimes(
        1,
      );
      expect(transactionRepositoryMock.save).toHaveBeenCalledTimes(1);
    });
  });
});
