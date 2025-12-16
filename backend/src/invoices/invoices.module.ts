import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceMaster, InvoiceItem } from '../entities/invoice-master.entity';
import { UserMain } from '../entities/user-main.entity';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesResolver } from './invoices.resolver';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceMaster, InvoiceItem, UserMain]),
    InventoryModule,
  ],
  providers: [InvoicesService, InvoicesResolver],
  controllers: [InvoicesController],
})
export class InvoicesModule { }
