import { Test, TestingModule } from '@nestjs/testing';
import { GetTotalAmountUseCase } from 'src/transaction/application/get-total-amount/get-total-amount.use-case';
import { IsChilizTransactionUseCase } from 'src/transaction/application/is-chiliz-transaction/is-chiliz-transaction.use-case';
import { TransactionController } from 'src/transaction/infrastructure/api/transaction.controller';
import { createMock } from '@golevelup/ts-jest';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  const isChilizTransactionUseCaseMock =
    createMock<IsChilizTransactionUseCase>();
  const getTotalAmountUseCaseMock = createMock<GetTotalAmountUseCase>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: IsChilizTransactionUseCase,
          useValue: isChilizTransactionUseCaseMock,
        },
        {
          provide: GetTotalAmountUseCase,
          useValue: getTotalAmountUseCaseMock,
        },
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
  });

  describe('Get is chiliz transaction', () => {
    it('should return true if transaction hash is from a chiliz transaction', async () => {
      isChilizTransactionUseCaseMock.execute.mockResolvedValue(true);
      const response = await transactionController.getIsChilizTransaction(
        'randomHash',
      );
      expect(response).toBeTruthy();
    });
  });

  describe('Get total amount', () => {
    it('should return total processed amount', async () => {
      const amount = 100;
      getTotalAmountUseCaseMock.execute.mockResolvedValue(amount);
      const response = await transactionController.getTotalAmount();
      expect(response).toBe(amount);
    });
  });
});
