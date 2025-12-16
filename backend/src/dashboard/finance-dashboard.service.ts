import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InvoiceMaster, InvoiceItem } from '../entities/invoice-master.entity';
import { InventoryMaster } from '../entities/inventory-master.entity';
import {
  FinanceDashboard,
  FinanceDashboardCache,
  TransactionItem,
  FinanceCharts,
} from '../entities/finance-dashboard.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Injectable()
export class FinanceDashboardService {
  constructor(
    @InjectRepository(InvoiceMaster)
    private invoiceRepository: Repository<InvoiceMaster>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(FinanceDashboardCache)
    private cacheRepository: Repository<FinanceDashboardCache>,
  ) {}

  async getFinanceDashboard(userPublicId: string): Promise<FinanceDashboard> {
    // Get all invoices for this user
    const incomeInvoices = await this.invoiceRepository.find({
      where: {
        bill_from_public_id: userPublicId,
        invoice_type: 'income',
        status: 'approved',
      },
      order: { invoice_date: 'DESC' },
    });

    const expenseInvoices = await this.invoiceRepository.find({
      where: {
        bill_to_public_id: userPublicId,
        invoice_type: 'expense',
        status: 'approved',
      },
      order: { invoice_date: 'DESC' },
    });

    // Calculate totals
    const total_income = incomeInvoices.reduce(
      (sum, inv) => sum + Number(inv.total_amount),
      0,
    );
    const total_expense = expenseInvoices.reduce(
      (sum, inv) => sum + Number(inv.total_amount),
      0,
    );
    const balance = total_income - total_expense;

    // Build transactions list (last 50)
    const allInvoices = [...incomeInvoices, ...expenseInvoices]
      .sort((a, b) => b.invoice_date.getTime() - a.invoice_date.getTime())
      .slice(0, 50);

    const transactions: TransactionItem[] = allInvoices.map((inv) => ({
      date: inv.invoice_date,
      invoice_number: inv.invoice_number,
      description:
        inv.invoice_type === 'income'
          ? `Income from ${inv.bill_to_name || inv.bill_to_public_id}`
          : `Expense to ${inv.bill_from_name || inv.bill_from_public_id}`,
      category: inv.invoice_type,
      amount: Number(inv.total_amount),
      type: inv.invoice_type,
    }));

    // Generate charts data
    const charts = await this.generateCharts(userPublicId);

    // Update cache
    await this.updateCache(userPublicId, total_income, total_expense, balance);

    const dashboard: FinanceDashboard = {
      total_income,
      total_expense,
      balance,
      transactions,
      charts,
    };

    // Publish to subscription
    await pubSub.publish('financeDashboardUpdated', {
      financeDashboardUpdated: dashboard,
      userPublicId,
    });

    return dashboard;
  }

  private async generateCharts(userPublicId: string): Promise<FinanceCharts> {
    // Get invoice items for sales analysis
    const incomeInvoices = await this.invoiceRepository.find({
      where: {
        bill_from_public_id: userPublicId,
        invoice_type: 'income',
        status: 'approved',
      },
      relations: ['items'],
    });

    // Sales by item
    const itemSales = new Map<string, number>();
    for (const invoice of incomeInvoices) {
      const items = await this.invoiceItemRepository.find({
        where: { invoice_id: invoice.id },
      });

      for (const item of items) {
        // Get inventory details for description
        const inventory = await this.inventoryRepository.findOne({
          where: { inventory_id: item.inventory_id },
        });

        const itemName = inventory?.description || item.inventory_id;
        const current = itemSales.get(itemName) || 0;
        itemSales.set(itemName, current + Number(item.total_price));
      }
    }

    const sales_by_item = Array.from(itemSales.entries())
      .map(([item_name, total_amount]) => ({ item_name, total_amount }))
      .sort((a, b) => b.total_amount - a.total_amount)
      .slice(0, 10);

    // Monthly sales (last 12 months)
    const monthly_sales = await this.getMonthlyData(userPublicId, 12);

    // Weekly sales (last 7 days)
    const weekly_sales = await this.getWeeklyData(userPublicId);

    // Monthly sales count
    const monthly_sales_count = await this.getMonthlySalesCount(
      userPublicId,
      12,
    );

    return {
      sales_by_item,
      monthly_sales,
      weekly_sales,
      monthly_sales_count,
    };
  }

  private async getMonthlyData(userPublicId: string, months: number) {
    const now = new Date();
    const monthsData: Array<{ month: string; total_amount: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const invoices = await this.invoiceRepository.find({
        where: {
          bill_from_public_id: userPublicId,
          invoice_type: 'income',
          status: 'approved',
          invoice_date: Between(date, nextMonth),
        },
      });

      const total_amount = invoices.reduce(
        (sum, inv) => sum + Number(inv.total_amount),
        0,
      );

      monthsData.push({
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        total_amount,
      });
    }

    return monthsData;
  }

  private async getWeeklyData(userPublicId: string) {
    const weekData: Array<{ day: string; total_amount: number }> = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const invoices = await this.invoiceRepository.find({
        where: {
          bill_from_public_id: userPublicId,
          invoice_type: 'income',
          status: 'approved',
          invoice_date: Between(startOfDay, endOfDay),
        },
      });

      const total_amount = invoices.reduce(
        (sum, inv) => sum + Number(inv.total_amount),
        0,
      );

      weekData.push({
        day: startOfDay.toLocaleDateString('en-US', { weekday: 'short' }),
        total_amount,
      });
    }

    return weekData;
  }

  private async getMonthlySalesCount(userPublicId: string, months: number) {
    const now = new Date();
    const countsData: Array<{ month: string; count: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = await this.invoiceRepository.count({
        where: {
          bill_from_public_id: userPublicId,
          invoice_type: 'income',
          status: 'approved',
          invoice_date: Between(date, nextMonth),
        },
      });

      countsData.push({
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        count,
      });
    }

    return countsData;
  }

  private async updateCache(
    userPublicId: string,
    total_income: number,
    total_expense: number,
    balance: number,
  ) {
    let cache = await this.cacheRepository.findOne({
      where: { user_public_id: userPublicId },
    });

    if (cache) {
      cache.total_income = total_income;
      cache.total_expense = total_expense;
      cache.balance = balance;
    } else {
      cache = this.cacheRepository.create({
        user_public_id: userPublicId,
        total_income,
        total_expense,
        balance,
      });
    }

    await this.cacheRepository.save(cache);
  }

  getFinanceDashboardSubscription(): AsyncIterator<any> {
    return pubSub.asyncIterableIterator(
      'financeDashboardUpdated',
    ) as AsyncIterator<any>;
  }
}
