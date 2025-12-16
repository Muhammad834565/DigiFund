import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class FinanceOverview {
    @Field(() => Float)
    total_income: number;

    @Field(() => Float)
    total_expense: number;

    @Field(() => Float)
    balance: number;

    @Field(() => Float)
    pending_income: number;

    @Field(() => Float)
    pending_expense: number;
}
