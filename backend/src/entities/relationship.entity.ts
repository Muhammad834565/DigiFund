import { Field, ObjectType, Int } from '@nestjs/graphql';
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
@Entity('relationship_requests')
export class RelationshipRequest {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 20 })
  @Index()
  requester_public_id: string;

  @Field()
  @Column({ length: 20 })
  @Index()
  requested_public_id: string;

  @Field()
  @Column({ length: 20 })
  relationship_type: string; // supplier, consumer

  @Field()
  @Column({ default: 'pending', length: 20 })
  status: string; // pending, accepted, rejected

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserMain)
  @JoinColumn({
    name: 'requester_public_id',
    referencedColumnName: 'public_id',
  })
  requester: UserMain;

  @ManyToOne(() => UserMain)
  @JoinColumn({
    name: 'requested_public_id',
    referencedColumnName: 'public_id',
  })
  requested: UserMain;
}

@ObjectType()
@Entity('supplier_relationships')
export class SupplierRelationship {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 20 })
  @Index()
  owner_public_id: string;

  @Field()
  @Column({ length: 20 })
  @Index()
  supplier_public_id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  company_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contact_person?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  phone_no?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  location?: string;

  @Field()
  @Column({ default: 'active', length: 50 })
  status: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'owner_public_id', referencedColumnName: 'public_id' })
  owner: UserMain;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'supplier_public_id', referencedColumnName: 'public_id' })
  supplier: UserMain;
}

@ObjectType()
@Entity('consumer_relationships')
export class ConsumerRelationship {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 20 })
  @Index()
  owner_public_id: string;

  @Field()
  @Column({ length: 20 })
  @Index()
  consumer_public_id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  company_name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contact_person?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  phone_no?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  location?: string;

  @Field()
  @Column({ default: 'active', length: 50 })
  status: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'owner_public_id', referencedColumnName: 'public_id' })
  owner: UserMain;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'consumer_public_id', referencedColumnName: 'public_id' })
  consumer: UserMain;
}

export enum RelationshipType {
  SUPPLIER = 'supplier',
  CONSUMER = 'consumer',
}

export enum RelationshipRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
