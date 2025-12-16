import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserMain } from './user-main.entity';

@ObjectType()
@Entity('invoices_master')
export class InvoiceMaster {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, length: 20 })
  @Index()
  invoice_number: string;

  @Field()
  @Column({ length: 20 })
  invoice_type: string; // income, expense

  @Field()
  @Column({ default: 'pending', length: 20 })
  status: string; // pending, approved, declined, paid

  @Field()
  @Column({ length: 20 })
  @Index()
  bill_from_public_id: string;

  @Field()
  @Column({ length: 20 })
  @Index()
  bill_to_public_id: string;

  @Field()
  @Column({ default: 'waiting', length: 20 })
  bill_from_status: string;

  @Field()
  @Column({ default: 'pending', length: 20 })
  bill_to_status: string;

  @Field()
  @Column({ type: 'timestamp' })
  invoice_date: Date;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bill_to_name?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bill_to_address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bill_to_email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  bill_to_phone?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bill_from_name?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bill_from_address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bill_from_email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  bill_from_phone?: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [InvoiceItem], { nullable: true })
  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];

  @ManyToOne(() => UserMain)
  @JoinColumn({
    name: 'bill_from_public_id',
    referencedColumnName: 'public_id',
  })
  billFromUser: UserMain;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'bill_to_public_id', referencedColumnName: 'public_id' })
  billToUser: UserMain;
}

@ObjectType()
@Entity('invoice_items')
export class InvoiceItem {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  @Index()
  invoice_id: number;

  @Field()
  @Column({ length: 50 })
  @Index()
  inventory_id: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  qty: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  rate: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discount_percentage: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_price: number;

  @ManyToOne(() => InvoiceMaster, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceMaster;
}

export enum InvoiceType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum InvoiceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  PAID = 'paid',
}
