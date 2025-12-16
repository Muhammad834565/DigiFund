import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { FinanceDashboardResolver } from './finance-dashboard.resolver';
import { DashboardStats } from '../entities/dashboard-stats.entity';
import { Customer } from '../entities/customer.entity';
import { InventoryMaster } from '../entities/inventory-master.entity';
import { InvoiceMaster, InvoiceItem } from '../entities/invoice-master.entity';
import { UserMain } from '../entities/user-main.entity';
import { FinanceDashboardCache } from '../entities/finance-dashboard.entity';
import { FinanceDashboardService } from './finance-dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DashboardStats,
      Customer,
      InventoryMaster,
      InvoiceMaster,
      UserMain,
      InvoiceItem,
      FinanceDashboardCache,
    ]),
  ],
  controllers: [],
  providers: [
    DashboardService,
    DashboardResolver,
    FinanceDashboardResolver,
    FinanceDashboardService
  ],
  exports: [DashboardService, FinanceDashboardService],
})
export class DashboardModule { }
