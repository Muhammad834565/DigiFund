import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceMaster } from '../entities/invoice-master.entity';
import { FinanceService } from './finance.service';
import { FinanceResolver } from './finance.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([InvoiceMaster])],
    providers: [FinanceService, FinanceResolver],
})
export class FinanceModule { }
