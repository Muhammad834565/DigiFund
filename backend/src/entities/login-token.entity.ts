import { Field, ObjectType, Int } from '@nestjs/graphql';
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
@Entity('login_tokens')
export class LoginToken {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  @Index()
  user_id: number;

  @Field()
  @Column({ length: 20 })
  @Index()
  public_id: string;

  @Field()
  @Column({ length: 15 })
  private_id: string;

  @Field()
  @Column({ type: 'text' })
  @Index()
  token: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Field()
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => UserMain)
  @JoinColumn({ name: 'user_id' })
  user: UserMain;
}
