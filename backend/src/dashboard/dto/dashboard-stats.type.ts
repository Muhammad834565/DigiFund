import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class DashboardStatsType {
  @Field()
  id: string;

  @Field(() => Int)
  totalCustomers: number;

  @Field(() => Int)
  totalProducts: number;

  @Field(() => Int)
  totalInvoices: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Int)
  activeUsers: number;

  @Field(() => Int)
  pendingInvoices: number;

  @Field()
  timestamp: Date;
}
