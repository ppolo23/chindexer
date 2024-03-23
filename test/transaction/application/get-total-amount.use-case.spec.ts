import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { TransactionRepository } from 'src/transaction/domain/ports/transaction.repository';
import { GetTotalAmountUseCase } from 'src/transaction/application/get-total-amount/get-total-amount.use-case';

describe('GetTotalAmountUseCase', () => {
  let useCase: GetTotalAmountUseCase;
  const transactionRepositoryMock = createMock<TransactionRepository>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        GetTotalAmountUseCase,
        {
          provide: 'TransactionRepository',
          useValue: transactionRepositoryMock,
        },
      ],
    }).compile();

    useCase = app.get<GetTotalAmountUseCase>(GetTotalAmountUseCase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Execute', () => {
    it('should return total amount', async () => {
      const totalAmount = 100;
      transactionRepositoryMock.getTotalAmount.mockResolvedValue(totalAmount);

      const response = await useCase.execute();
      expect(response).toBe(totalAmount);
    });
  });
});
