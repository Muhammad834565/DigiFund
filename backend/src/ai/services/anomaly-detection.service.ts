import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { InvoiceMaster } from '../../entities/invoice-master.entity';
import { InventoryMaster } from '../../entities/inventory-master.entity';
import { AnomalyLog } from '../../entities/anomaly-log.entity';
import { AnomalyDetectionResult } from '../dto/ai-types';

/**
 * AnomalyDetectionService
 *
 * Detects unusual patterns in sales data.
 */
@Injectable()
export class AnomalyDetectionService {
  private readonly logger = new Logger(AnomalyDetectionService.name);
  private readonly ANOMALY_THRESHOLD = 3; // Z-score threshold

  constructor(
    @InjectRepository(InvoiceMaster)
    private invoiceRepository: Repository<InvoiceMaster>,
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(AnomalyLog)
    private anomalyLogRepository: Repository<AnomalyLog>,
  ) { }

  /**
   * Detect All Anomalies
   */
  async detectAllAnomalies(): Promise<AnomalyDetectionResult[]> {
    try {
      this.logger.log('Starting anomaly detection');

      const anomalies: AnomalyDetectionResult[] = [];

      // Check for unusual revenue spikes
      const revenueAnomalies = await this.detectRevenueSpikes();
      anomalies.push(...revenueAnomalies);

      // Check for unusual invoice counts
      const countAnomalies = await this.detectInvoiceCountSpikes();
      anomalies.push(...countAnomalies);

      this.logger.log(`Detected ${anomalies.length} anomalies`);
      return anomalies;
    } catch (error) {
      this.logger.error('Failed to detect anomalies:', error);
      throw error;
    }
  }

  /**
   * Detect Revenue Spikes
   */
  private async detectRevenueSpikes(): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];

    // Get daily revenue for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInvoices = await this.invoiceRepository.find({
      where: {
        created_at: MoreThan(thirtyDaysAgo),
      },
    });

    if (recentInvoices.length < 7) return anomalies;

    // Group by day
    const dailyRevenue = new Map<string, number>();

    recentInvoices.forEach((invoice) => {
      const day = invoice.created_at.toISOString().split('T')[0];
      dailyRevenue.set(
        day,
        (dailyRevenue.get(day) || 0) + Number(invoice.total_amount),
      );
    });

    const revenues = Array.from(dailyRevenue.values());

    if (revenues.length < 7) return anomalies;

    const stats = this.calculateStatistics(revenues);

    // Check today's revenue
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = dailyRevenue.get(today) || 0;

    if (todayRevenue === 0) return anomalies;

    const zScore = (todayRevenue - stats.mean) / stats.stdDev;

    if (Math.abs(zScore) > this.ANOMALY_THRESHOLD) {
      // Create anomaly log
      const log = await this.anomalyLogRepository.save({
        anomalyType: zScore > 0 ? 'revenue_spike' : 'revenue_drop',
        description: `Revenue ${zScore > 0 ? 'spike' : 'drop'}: $${todayRevenue.toFixed(2)} (normal: $${stats.mean.toFixed(2)})`,
        anomalyScore: Math.abs(zScore) * 10,
        metadata: {
          todayRevenue,
          averageRevenue: stats.mean,
          zScore,
        },
      });

      anomalies.push({
        id: log.id,
        productId: 'system',
        productName: 'System-wide',
        anomalyType: log.anomalyType,
        description: log.description,
        anomalyScore: log.anomalyScore,
        detectedAt: log.detectedAt,
      });
    }

    return anomalies;
  }

  /**
   * Detect Invoice Count Spikes
   */
  private async detectInvoiceCountSpikes(): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInvoices = await this.invoiceRepository.find({
      where: {
        created_at: MoreThan(thirtyDaysAgo),
      },
    });

    if (recentInvoices.length < 7) return anomalies;

    // Group by day
    const dailyCounts = new Map<string, number>();

    recentInvoices.forEach((invoice) => {
      const day = invoice.created_at.toISOString().split('T')[0];
      dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
    });

    const counts = Array.from(dailyCounts.values());

    if (counts.length < 7) return anomalies;

    const stats = this.calculateStatistics(counts);

    const today = new Date().toISOString().split('T')[0];
    const todayCount = dailyCounts.get(today) || 0;

    if (todayCount === 0) return anomalies;

    const zScore = (todayCount - stats.mean) / stats.stdDev;

    if (Math.abs(zScore) > this.ANOMALY_THRESHOLD) {
      const log = await this.anomalyLogRepository.save({
        anomalyType: 'invoice_spike',
        description: `Invoice count spike: ${todayCount} invoices (normal: ${stats.mean.toFixed(1)})`,
        anomalyScore: Math.abs(zScore) * 10,
        metadata: {
          todayCount,
          averageCount: stats.mean,
          zScore,
        },
      });

      anomalies.push({
        id: log.id,
        productId: 'system',
        productName: 'System-wide',
        anomalyType: log.anomalyType,
        description: log.description,
        anomalyScore: log.anomalyScore,
        detectedAt: log.detectedAt,
      });
    }

    return anomalies;
  }

  /**
   * Calculate Statistics
   */
  private calculateStatistics(values: number[]): {
    mean: number;
    stdDev: number;
  } {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;

    const stdDev = Math.sqrt(variance) || 1; // Prevent division by zero

    return { mean, stdDev };
  }

  /**
   * Get Recent Anomalies
   */
  async getRecentAnomalies(days: number = 7): Promise<AnomalyLog[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.anomalyLogRepository.find({
      where: {
        detectedAt: MoreThan(startDate),
      },
      order: {
        detectedAt: 'DESC',
      },
    });
  }
}
