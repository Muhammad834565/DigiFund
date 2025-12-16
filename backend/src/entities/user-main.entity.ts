import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@ObjectType()
@Entity('user_main')
export class UserMain {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, length: 20 })
  @Index()
  public_id: string;

  @Field()
  @Column({ unique: true, length: 15 })
  @Index()
  private_id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  company_name?: string;

  @Field()
  @Column()
  contact_person: string;

  @Field()
  @Column({ unique: true })
  @Index()
  email: string;

  @Field()
  @Column({ unique: true, length: 20 })
  @Index()
  phone_no: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @Field()
  @Column({ default: 'active', length: 50 })
  status: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  gender?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 100 })
  type_of_business?: string;

  @Field()
  @Column({ length: 50 })
  @Index()
  role: string;

  @Column()
  password: string;

  @Field()
  @Column({ default: false })
  is_verified: boolean;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}

export enum UserRole {
  GUEST_USER = 'guest_user',
  SUPPLIER = 'supplier',
  CONSUMER = 'consumer',
  INVENTORY_MANAGER = 'inventory_manager',
  FINANCIAL_MANAGER = 'financial_manager',
  STUDENT = 'student',
  BUSINESS_OWNER = 'business_owner',
}

export const RolePrefixMap = {
  [UserRole.GUEST_USER]: 'gus',
  [UserRole.SUPPLIER]: 'sup',
  [UserRole.CONSUMER]: 'cos',
  [UserRole.INVENTORY_MANAGER]: 'inv',
  [UserRole.FINANCIAL_MANAGER]: 'fin',
  [UserRole.STUDENT]: 'stu',
  [UserRole.BUSINESS_OWNER]: 'digi',
};
