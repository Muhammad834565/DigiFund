import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class InvoiceItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  inventory_id: string; // References inventory_master.inventory_id

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  discount_percentage?: number;
}

@InputType()
export class CreateInvoiceInput {
  // Provide ONE of these three: public_id, email, or phone_no
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bill_to_public_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bill_to_email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bill_to_phone?: string;

  @Field(() => [InvoiceItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemInput)
  items: InvoiceItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class UpdateInvoiceInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [InvoiceItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemInput)
  items?: InvoiceItemInput[];
}

@InputType()
export class UpdateInvoiceStatusInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  invoice_number: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(['pending', 'approved', 'declined', 'paid'])
  status: string;
}
