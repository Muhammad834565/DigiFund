import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SupplierResponse {
  @Field(() => Int)
  id: number;

  @Field()
  supplier_public_id: string;

  @Field({ nullable: true })
  company_name?: string;

  @Field()
  contact_person: string;

  @Field()
  email: string;

  @Field()
  phone_no: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  status: string;

  @Field()
  created_at: Date;
}

@ObjectType()
export class ConsumerResponse {
  @Field(() => Int)
  id: number;

  @Field()
  consumer_public_id: string;

  @Field({ nullable: true })
  company_name?: string;

  @Field()
  contact_person: string;

  @Field()
  email: string;

  @Field()
  phone_no: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  status: string;

  @Field()
  created_at: Date;
}
