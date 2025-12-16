import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('dashboard_stats')
export class DashboardStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  totalCustomers: number;

  @Column()
  totalProducts: number;

  @Column()
  totalInvoices: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalRevenue: number;

  @Column()
  activeUsers: number;

  @Column()
  pendingInvoices: number;

  @CreateDateColumn()
  timestamp: Date;
}
