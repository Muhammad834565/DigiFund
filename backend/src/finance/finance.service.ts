import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceMaster, InvoiceStatus } from '../entities/invoice-master.entity';
import { FinanceOverview } from './dto/finance-overview.type';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(InvoiceMaster)
        private invoiceRepository: Repository<InvoiceMaster>,
    ) { }

    async getFinanceDashboard(userPublicId: string): Promise<FinanceOverview> {
        // 1. Calculate Total Income: Where I am the SENDER (Bill From) and status is PAID
        const totalIncomeResult = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.total_amount)', 'sum')
            .where('invoice.bill_from_public_id = :userPublicId', { userPublicId })
            .andWhere('invoice.status = :status', { status: InvoiceStatus.PAID })
            .getRawOne();

        const totalIncome = parseFloat(totalIncomeResult.sum || '0');

        // 2. Calculate Total Expense: Where I am the RECEIVER (Bill To) and status is PAID
        const totalExpenseResult = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.total_amount)', 'sum')
            .where('invoice.bill_to_public_id = :userPublicId', { userPublicId })
            .andWhere('invoice.status = :status', { status: InvoiceStatus.PAID })
            .getRawOne();

        const totalExpense = parseFloat(totalExpenseResult.sum || '0');

        // 3. Pending Income: SENDER and status != PAID (Pending, Approved, Declined?) - Usually Pending/Approved
        // Let's assume Pending or Approved. Declined means we probably won't get it.
        const pendingIncomeResult = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.total_amount)', 'sum')
            .where('invoice.bill_from_public_id = :userPublicId', { userPublicId })
            .andWhere('invoice.status IN (:...statuses)', { statuses: [InvoiceStatus.PENDING, InvoiceStatus.APPROVED] })
            .getRawOne();

        const pendingIncome = parseFloat(pendingIncomeResult.sum || '0');

        // 4. Pending Expense: RECEIVER and status != PAID
        const pendingExpenseResult = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.total_amount)', 'sum')
            .where('invoice.bill_to_public_id = :userPublicId', { userPublicId })
            .andWhere('invoice.status IN (:...statuses)', { statuses: [InvoiceStatus.PENDING, InvoiceStatus.APPROVED] })
            .getRawOne();

        const pendingExpense = parseFloat(pendingExpenseResult.sum || '0');

        return {
            total_income: totalIncome,
            total_expense: totalExpense,
            balance: totalIncome - totalExpense,
            pending_income: pendingIncome,
            pending_expense: pendingExpense,
        };
    }
}
