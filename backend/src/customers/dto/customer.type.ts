import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CustomerType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;
}
