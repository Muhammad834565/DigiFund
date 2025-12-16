import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardStats } from '../entities/dashboard-stats.entity';
import { Customer } from '../entities/customer.entity';
import { InventoryMaster } from '../entities/inventory-master.entity';
import { InvoiceMaster, InvoiceStatus } from '../entities/invoice-master.entity';
import { UserMain } from '../entities/user-main.entity';
import { InvoiceChartData, InvoiceDailyStat } from './dto/invoice-chart.type';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardStats)
    private dashboardStatsRepository: Repository<DashboardStats>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(InvoiceMaster)
    private invoiceRepository: Repository<InvoiceMaster>,
    @InjectRepository(UserMain)
    private userRepository: Repository<UserMain>,
  ) { }

  async getUserStats(userPublicId: string): Promise<DashboardStats> {
    const totalCustomers = await this.customerRepository.count({
      where: { owner_public_id: userPublicId }
    });
    const totalProducts = await this.inventoryRepository.count({
      where: { owner_public_id: userPublicId }
    });

    // Invoices: Assume "My Invoices" are ones I SENT (Bill From)
    const totalInvoices = await this.invoiceRepository.count({
      where: { bill_from_public_id: userPublicId }
    });

    // Active Users: In a personalized context, maybe this just means "Total Users in System" (global context) 
    // or "Users I interact with". Let's keep it global or return 1 (me). 
    // Usually dashboard shows global active users for admins, but for regular users?
    // Let's show global active users for now as it's a common metric.
    const activeUsers = await this.userRepository.count();

    // Revenue: Invoices I SENT that are PAID
    const invoices = await this.invoiceRepository.find({
      where: {
        bill_from_public_id: userPublicId,
        // status: InvoiceStatus.PAID // Revenue usually implies realized income? Or potental?
        // Let's match previous logic: Sum of ALL total_amount (often revenue dashboard shows potential too)
        // But strictly revenue should be PAID. 
        // Previous implementation summed ALL invoices. Let's stick to that for consistency unless specified.
      }
    });

    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount || 0),
      0,
    );

    // Pending Invoices: I SENT and are PENDING
    const pendingInvoices = await this.invoiceRepository.count({
      where: {
        bill_from_public_id: userPublicId,
        status: InvoiceStatus.PENDING
      },
    });

    // We don't save per-user stats to the global DashboardStats table (which seems designed for system snapshots)
    // So we just return an object that matches the shape.
    // DTO needs to be returned.

    const stats = new DashboardStats();
    stats.id = 'temp'; // Not saved
    stats.totalCustomers = totalCustomers;
    stats.totalProducts = totalProducts;
    stats.totalInvoices = totalInvoices;
    stats.totalRevenue = totalRevenue;
    stats.activeUsers = activeUsers;
    stats.pendingInvoices = pendingInvoices;
    stats.timestamp = new Date();

    return stats;
  }

  // Keeping original methods for backward compatibility or admin usage if needed, 
  // but Resolver now calls getUserStats.

  async getLatestStats(): Promise<DashboardStats> {
    const stats = await this.dashboardStatsRepository.find({
      order: { timestamp: 'DESC' },
      take: 1,
    });

    if (stats.length > 0) {
      return stats[0];
    }

    // Generate new stats if none exist
    return this.generateStats();
  }

  async generateStats(): Promise<DashboardStats> {
    const totalCustomers = await this.customerRepository.count();
    const totalProducts = await this.inventoryRepository.count();
    const totalInvoices = await this.invoiceRepository.count();
    const activeUsers = await this.userRepository.count();

    // Calculate total revenue
    const invoices = await this.invoiceRepository.find();
    // Assuming total_amount is string or number, safely cast
    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount || 0),
      0,
    );

    // Count pending invoices
    const pendingInvoices = await this.invoiceRepository.count({
      where: { status: InvoiceStatus.PENDING },
    });

    const stats = this.dashboardStatsRepository.create({
      totalCustomers,
      totalProducts,
      totalInvoices,
      totalRevenue,
      activeUsers,
      pendingInvoices,
    });

    return this.dashboardStatsRepository.save(stats);
  }

  async getInvoiceCharts(userPublicId: string): Promise<InvoiceChartData> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Query DB for raw stats
    const rawStats = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select("TO_CHAR(invoice.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(invoice.id)', 'count')
      .addSelect('SUM(invoice.total_amount)', 'total')
      .where('invoice.bill_from_public_id = :userPublicId', { userPublicId })
      .andWhere('invoice.created_at >= :sevenDaysAgo', { sevenDaysAgo })
      .groupBy("TO_CHAR(invoice.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany();

    // rawStats: [{ date: '2025-12-10', count: '2', total: '100.50' }, ...]

    // Prepare map for 7 days
    const statsMap = new Map<string, InvoiceDailyStat>();

    // Fill map from DB results
    rawStats.forEach(stat => {
      statsMap.set(stat.date, {
        date: stat.date,
        count: parseInt(stat.count, 10),
        totalAmount: parseFloat(stat.total || '0')
      });
    });

    // Generate last 7 days inclusive today
    const result: InvoiceDailyStat[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD

      if (statsMap.has(dateStr)) {
        result.push(statsMap.get(dateStr)!);
      } else {
        result.push({ date: dateStr, count: 0, totalAmount: 0 });
      }
    }

    return { last7Days: result };
  }

  async *streamStats(
    intervalMs: number = 2000,
  ): AsyncGenerator<DashboardStats> {
    while (true) {
      const stats = await this.generateStats();
      yield stats;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
}
