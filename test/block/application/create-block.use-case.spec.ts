import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CreateBlockRequest } from 'src/block/application/create-block/create-block.request';
import { CreateBlockUseCase } from 'src/block/application/create-block/create-block.use-case';
import { Block } from 'src/block/domain/models/block';
import { BlockRepository } from 'src/block/domain/ports/block.repository';

describe('CreateBlockUseCase', () => {
  let useCase: CreateBlockUseCase;
  const blockRepositoryMock = createMock<BlockRepository>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        CreateBlockUseCase,
        {
          provide: 'BlockRepository',
          useValue: blockRepositoryMock,
        },
      ],
    }).compile();

    useCase = app.get<CreateBlockUseCase>(CreateBlockUseCase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Execute', () => {
    it('should create a new block', async () => {
      const blockDate = new Date();
      const block = new Block('hash', 1, blockDate);
      const request = new CreateBlockRequest(
        block.hash,
        block.number,
        BigInt(block.tiemstamp.getTime()),
      );
      blockRepositoryMock.save.mockResolvedValue(block);
      const createdBlock = await useCase.execute(request);
      expect(blockRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(createdBlock).toBe(block);
    });
  });
});
