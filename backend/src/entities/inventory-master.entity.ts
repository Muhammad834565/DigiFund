import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserMain } from './user-main.entity';

@ObjectType()
@Entity('inventory_master')
export class InventoryMaster {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, length: 50 })
  inventory_id: string;

  @Field()
  @Column({ length: 20 })
  @Index()
  owner_public_id: string;

  @Field()
  @Column({ length: 100 })
  @Index()
  name: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Field(() => Int)
  @Column({ default: 0 })
  quantity: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unit_price: number;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true, length: 100 })
  @Index()
  sku?: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  images?: string[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'owner_public_id', referencedColumnName: 'public_id' })
  owner: UserMain;
}
