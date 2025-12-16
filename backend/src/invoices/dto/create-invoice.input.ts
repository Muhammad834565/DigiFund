import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  ValidateNested,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceItemInput } from '../../common/dto/invoice.input';

@InputType()
export class CreateInvoiceInput {
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
