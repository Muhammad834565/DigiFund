import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@ObjectType()
@Entity('digi_otp')
export class DigiOtp {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Index()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  phone_no?: string;

  @Column({ length: 6 })
  otp: string;

  @Field()
  @Column({ length: 50 })
  purpose: string; // signup, forgot_password

  @Field(() => Int)
  @Column({ default: 0 })
  attempts: number;

  @Field(() => Int)
  @Column({ default: 5 })
  max_attempts: number;

  @Field()
  @Column({ default: false })
  is_verified: boolean;

  @Field()
  @CreateDateColumn()
  @Index()
  created_at: Date;

  @Field()
  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Field()
  @Column({ default: true })
  is_active: boolean;
}

export enum OtpPurpose {
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot_password',
}
