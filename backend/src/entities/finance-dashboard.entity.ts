import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class TransactionItem {
  @Field()
  date: Date;

  @Field()
  invoice_number: string;

  @Field()
  description: string;

  @Field()
  category: string;

  @Field(() => Float)
  amount: number;

  @Field()
  type: string; // income or expense
}

@ObjectType()
export class SalesByItem {
  @Field()
  item_name: string;

  @Field(() => Float)
  total_amount: number;
}

@ObjectType()
export class MonthlySales {
  @Field()
  month: string;

  @Field(() => Float)
  total_amount: number;
}

@ObjectType()
export class WeeklySales {
  @Field()
  day: string;

  @Field(() => Float)
  total_amount: number;
}

@ObjectType()
export class MonthlySalesCount {
  @Field()
  month: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class FinanceCharts {
  @Field(() => [SalesByItem])
  sales_by_item: SalesByItem[];

  @Field(() => [MonthlySales])
  monthly_sales: MonthlySales[];

  @Field(() => [WeeklySales])
  weekly_sales: WeeklySales[];

  @Field(() => [MonthlySalesCount])
  monthly_sales_count: MonthlySalesCount[];
}

@ObjectType()
export class FinanceDashboard {
  @Field(() => Float)
  total_income: number;

  @Field(() => Float)
  total_expense: number;

  @Field(() => Float)
  balance: number;

  @Field(() => [TransactionItem])
  transactions: TransactionItem[];

  @Field(() => FinanceCharts)
  charts: FinanceCharts;
}

@ObjectType()
@Entity('finance_dashboard_cache')
export class FinanceDashboardCache {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 20 })
  user_public_id: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_income: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_expense: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
