import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';
import { BlockchainRepository } from 'src/shared/ports/blockchain.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsChilizTransactionUseCase } from 'src/transaction/application/is-chiliz-transaction/is-chiliz-transaction.use-case';
import { Transaction } from 'src/transaction/domain/models/transaction';
import { createTransactionReceiptToAddress } from 'test/utils/test-utils';

describe('IsChilizTransactionUseCase', () => {
  let useCase: IsChilizTransactionUseCase;
  const configServiceMock = createMock<ConfigService>;
  const transactionRepositoryMock = createMock<TransactionRepository>();
  const blockchainRepositoryMock = createMock<BlockchainRepository>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        IsChilizTransactionUseCase,
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

    useCase = app.get<IsChilizTransactionUseCase>(IsChilizTransactionUseCase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Execute', () => {
    it('should return true if transaction is stored in db', async () => {
      const txHash = 'hash';
      const existingTransaction = new Transaction(
        txHash,
        'address1',
        'address2',
        1,
        1,
      );
      transactionRepositoryMock.findOneByHash.mockResolvedValue(
        existingTransaction,
      );

      const response = await useCase.execute(txHash);

      expect(response).toBeTruthy();
      expect(transactionRepositoryMock.findOneByHash).toBeCalledTimes(1);
      expect(blockchainRepositoryMock.getTransactionReceipt).toBeCalledTimes(0);
    });

    it('should return true if transaction is found in blockchain and belongs to CHZ', async () => {
      const existingTransaction = createTransactionReceiptToAddress(
        '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
      );
      transactionRepositoryMock.findOneByHash.mockResolvedValue(null);

      blockchainRepositoryMock.getTransactionReceipt.mockResolvedValue(
        existingTransaction,
      );

      const response = await useCase.execute(
        existingTransaction.transactionHash,
      );

      expect(response).toBeTruthy();
      expect(transactionRepositoryMock.findOneByHash).toBeCalledTimes(1);
      expect(blockchainRepositoryMock.getTransactionReceipt).toBeCalledTimes(1);
    });

    it('should return false if transaction is not in db and does not belong to CHZ', async () => {
      const existingTransaction =
        createTransactionReceiptToAddress('otherAddress');
      transactionRepositoryMock.findOneByHash.mockResolvedValue(null);
      blockchainRepositoryMock.getTransactionReceipt.mockResolvedValue(
        existingTransaction,
      );

      const response = await useCase.execute(
        existingTransaction.transactionHash,
      );

      expect(response).toBeFalsy();
      expect(transactionRepositoryMock.findOneByHash).toBeCalledTimes(1);
      expect(blockchainRepositoryMock.getTransactionReceipt).toBeCalledTimes(1);
    });
  });
});
