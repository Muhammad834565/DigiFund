import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMaster } from '../../entities/inventory-master.entity';
import { Customer } from '../../entities/customer.entity';
import * as Papa from 'papaparse';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateInventoryInput } from '../../common/dto/inventory.input';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';

// Define a temporary input class if CreateInventoryInput doesn't match perfectly or for loose validation
class CsvProductInput {
  name: string;
  price: number;
  stock: number;
  description: string;
}

@Injectable()
export class CsvUploadService {
  private readonly logger = new Logger(CsvUploadService.name);
  private readonly CHUNK_SIZE = 1000;

  constructor(
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  /**
   * Upload Products from CSV
   */
  async uploadProducts(fileBuffer: Buffer): Promise<{
    totalRows: number;
    successfulRows: number;
    failedRows: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    try {
      this.logger.log('Starting product CSV upload');

      const fileContent = fileBuffer.toString('utf-8');

      // Parse CSV
      const parseResult = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      const rows = parseResult.data as any[];
      this.logger.log(`Parsed ${rows.length} rows from CSV`);

      let successfulRows = 0;
      let failedRows = 0;
      const errors: Array<{ row: number; error: string }> = [];

      for (let i = 0; i < rows.length; i += this.CHUNK_SIZE) {
        const chunk = rows.slice(i, i + this.CHUNK_SIZE);
        this.logger.log(
          `Processing chunk ${Math.floor(i / this.CHUNK_SIZE) + 1} (rows ${i + 1}-${i + chunk.length})`,
        );

        const result = await this.processProductChunk(chunk, i);

        successfulRows += result.successful;
        failedRows += result.failed;
        errors.push(...result.errors);
      }

      this.logger.log(
        `Upload complete: ${successfulRows} successful, ${failedRows} failed`,
      );

      return {
        totalRows: rows.length,
        successfulRows,
        failedRows,
        errors,
      };
    } catch (error) {
      this.logger.error('Failed to upload CSV:', error);
      throw error;
    }
  }

  /**
   * Process Product Chunk
   */
  private async processProductChunk(
    chunk: any[],
    startIndex: number,
  ): Promise<{
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    const validProducts: InventoryMaster[] = [];
    const errors: Array<{ row: number; error: string }> = [];

    for (let i = 0; i < chunk.length; i++) {
      const rowData = chunk[i];
      const rowNumber = startIndex + i + 1;

      try {
        // Validation logic - using simple object for now matching CSV columns
        const price = parseFloat(rowData.price);
        const quantity = parseInt(rowData.stock || rowData.quantity);

        if (!rowData.name || isNaN(price) || isNaN(quantity)) {
          throw new Error("Missing required fields (name, price, stock/quantity)");
        }

        // Create inventory entity
        const product = this.inventoryRepository.create({
          name: rowData.name,
          description: rowData.description || rowData.name,
          unit_price: price,
          price: price * quantity, // derived field
          quantity: quantity,
          inventory_id: `INV-${Date.now()}-${rowNumber}`, // Generate ID
          owner_public_id: 'system', // Default or need context
          sku: `SKU-${Date.now()}-${rowNumber}`
        });

        validProducts.push(product);
      } catch (error) {
        errors.push({
          row: rowNumber,
          error: `Parse error: ${error.message}`,
        });
      }
    }

    if (validProducts.length > 0) {
      await this.inventoryRepository.save(validProducts);
    }

    return {
      successful: validProducts.length,
      failed: errors.length,
      errors,
    };
  }

  /**
   * Upload Customers from CSV
   */
  async uploadCustomers(fileBuffer: Buffer): Promise<{
    totalRows: number;
    successfulRows: number;
    failedRows: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    try {
      this.logger.log('Starting customer CSV upload');

      const fileContent = fileBuffer.toString('utf-8');

      const parseResult = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      const rows = parseResult.data as any[];
      this.logger.log(`Parsed ${rows.length} rows from CSV`);

      let successfulRows = 0;
      let failedRows = 0;
      const errors: Array<{ row: number; error: string }> = [];

      for (let i = 0; i < rows.length; i += this.CHUNK_SIZE) {
        const chunk = rows.slice(i, i + this.CHUNK_SIZE);
        this.logger.log(
          `Processing chunk ${Math.floor(i / this.CHUNK_SIZE) + 1}`,
        );

        const result = await this.processCustomerChunk(chunk, i);

        successfulRows += result.successful;
        failedRows += result.failed;
        errors.push(...result.errors);
      }

      this.logger.log(
        `Upload complete: ${successfulRows} successful, ${failedRows} failed`,
      );

      return {
        totalRows: rows.length,
        successfulRows,
        failedRows,
        errors,
      };
    } catch (error) {
      this.logger.error('Failed to upload CSV:', error);
      throw error;
    }
  }

  /**
   * Process Customer Chunk
   */
  private async processCustomerChunk(
    chunk: any[],
    startIndex: number,
  ): Promise<{
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    const validCustomers: Customer[] = [];
    const errors: Array<{ row: number; error: string }> = [];

    for (let i = 0; i < chunk.length; i++) {
      const rowData = chunk[i];
      const rowNumber = startIndex + i + 1;

      try {
        const dto = plainToClass(CreateCustomerDto, {
          name: rowData.name,
          email: rowData.email,
          phone: rowData.phone,
        });

        const validationErrors = await validate(dto);

        if (validationErrors.length > 0) {
          const errorMessages = validationErrors
            .map((e) => Object.values(e.constraints || {}).join(', '))
            .join('; ');

          errors.push({
            row: rowNumber,
            error: `Validation failed: ${errorMessages}`,
          });
          continue;
        }

        const existingCustomer = await this.customerRepository.findOne({
          where: { email: dto.email },
        });

        if (existingCustomer) {
          errors.push({
            row: rowNumber,
            error: `Duplicate email: ${dto.email}`,
          });
          continue;
        }

        const customer = this.customerRepository.create({
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
        });

        validCustomers.push(customer);
      } catch (error) {
        errors.push({
          row: rowNumber,
          error: `Parse error: ${error.message}`,
        });
      }
    }

    if (validCustomers.length > 0) {
      await this.customerRepository.save(validCustomers);
    }

    return {
      successful: validCustomers.length,
      failed: errors.length,
      errors,
    };
  }

  /**
   * Validate CSV Format
   */
  async validateCsvFormat(
    fileBuffer: Buffer,
    entityType: 'product' | 'customer',
  ): Promise<{
    valid: boolean;
    missingColumns: string[];
    extraColumns: string[];
  }> {
    const fileContent = fileBuffer.toString('utf-8');

    const parseResult = Papa.parse(fileContent, {
      header: true,
      preview: 1,
    });

    const headers = parseResult.meta.fields || [];

    const requiredColumns =
      entityType === 'product'
        ? ['name', 'price', 'stock']
        : ['name', 'email', 'phone'];

    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col),
    );

    const extraColumns = headers.filter(
      (col) => !requiredColumns.includes(col) && col !== 'description',
    );

    return {
      valid: missingColumns.length === 0,
      missingColumns,
      extraColumns,
    };
  }
}
