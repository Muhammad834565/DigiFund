import { IsNotEmpty, IsArray, ValidateNested, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  qty: number;
}

export class CreateInvoiceDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}
