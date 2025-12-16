import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesResolver } from './invoices.resolver';
import { InvoicesService } from './invoices.service';

describe('InvoicesResolver', () => {
  let resolver: InvoicesResolver;

  const mockInvoicesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesResolver,
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
      ],
    }).compile();

    resolver = module.get<InvoicesResolver>(InvoicesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
