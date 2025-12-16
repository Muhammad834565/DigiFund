import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * AnomalyLog Entity
 *
 * Stores detected anomalies in product sales patterns.
 * This helps identify unusual activity like:
 * - Products sold too frequently
 * - Unusual quantities
 * - Suspicious patterns
 */
@Entity('anomaly_logs')
export class AnomalyLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  anomalyType: string; // 'high_frequency', 'unusual_quantity', 'pattern_break'

  @Column('text')
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  anomalyScore: number; // 0-100, higher = more unusual

  @Column('jsonb', { nullable: true })
  metadata: any; // Additional context data

  @CreateDateColumn()
  detectedAt: Date;
}
