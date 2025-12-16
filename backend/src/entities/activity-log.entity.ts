import { Field, ObjectType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserMain } from './user-main.entity';

@ObjectType()
@Entity('activity_log')
export class ActivityLog {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 20 })
  @Index()
  user_public_id: string;

  @Field()
  @Column({ length: 50 })
  activity_type: string; // invoice_created, invoice_approved, inventory_added, etc.

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @Field()
  @CreateDateColumn()
  @Index()
  created_at: Date;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'user_public_id', referencedColumnName: 'public_id' })
  user: UserMain;
}

export enum ActivityType {
  INVOICE_CREATED = 'invoice_created',
  INVOICE_APPROVED = 'invoice_approved',
  INVOICE_DECLINED = 'invoice_declined',
  INVOICE_PAID = 'invoice_paid',
  INVENTORY_ADDED = 'inventory_added',
  INVENTORY_UPDATED = 'inventory_updated',
  INVENTORY_DELETED = 'inventory_deleted',
  SUPPLIER_ADDED = 'supplier_added',
  CONSUMER_ADDED = 'consumer_added',
  RELATIONSHIP_REQUEST_SENT = 'relationship_request_sent',
  RELATIONSHIP_REQUEST_ACCEPTED = 'relationship_request_accepted',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_SIGNUP = 'user_signup',
}
