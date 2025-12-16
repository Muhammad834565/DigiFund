import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class InvoiceItemType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  invoice_id: number;

  @Field()
  inventory_id: string;

  @Field(() => Float)
  qty: number;

  @Field(() => Float)
  rate: number;

  @Field(() => Float)
  discount_percentage: number;

  @Field(() => Float)
  total_price: number;
}

@ObjectType()
export class InvoiceType {
  @Field(() => Int)
  id: number;

  @Field()
  invoice_number: string;

  @Field()
  invoice_type: string;

  @Field()
  status: string;

  @Field()
  bill_from_public_id: string;

  @Field()
  bill_to_public_id: string;

  @Field()
  bill_from_status: string;

  @Field()
  bill_to_status: string;

  @Field()
  invoice_date: Date;

  @Field(() => Float)
  total_amount: number;

  @Field({ nullable: true })
  bill_to_name?: string;

  @Field({ nullable: true })
  bill_to_address?: string;

  @Field({ nullable: true })
  bill_to_email?: string;

  @Field({ nullable: true })
  bill_to_phone?: string;

  @Field({ nullable: true })
  bill_from_name?: string;

  @Field({ nullable: true })
  bill_from_address?: string;

  @Field({ nullable: true })
  bill_from_email?: string;

  @Field({ nullable: true })
  bill_from_phone?: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => [InvoiceItemType], { nullable: true })
  items?: InvoiceItemType[];
}
