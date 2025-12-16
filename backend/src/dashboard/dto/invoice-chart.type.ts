import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class InvoiceDailyStat {
    @Field()
    date: string; // YYYY-MM-DD

    @Field(() => Int)
    count: number;

    @Field(() => Float)
    totalAmount: number;
}

@ObjectType()
export class InvoiceChartData {
    @Field(() => [InvoiceDailyStat])
    last7Days: InvoiceDailyStat[];
}
