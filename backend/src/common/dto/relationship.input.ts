import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
} from 'class-validator';

@InputType()
export class SendRelationshipRequestInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  requested_public_id: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(['supplier', 'consumer'])
  relationship_type: string;
}

@InputType()
export class AcceptRejectRequestInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  request_id: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(['accepted', 'rejected'])
  action: string;
}

@InputType()
export class CreateSupplierInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  supplier_public_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;
}

@InputType()
export class UpdateSupplierInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;
}

@InputType()
export class CreateConsumerInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  consumer_public_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;
}

@InputType()
export class UpdateConsumerInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;
}

@InputType()
export class SearchUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  public_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_no?: string;
}
