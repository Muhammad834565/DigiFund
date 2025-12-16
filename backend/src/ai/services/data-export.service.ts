import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InventoryMaster } from '../../entities/inventory-master.entity';
import { Customer } from '../../entities/customer.entity';
import { InvoiceMaster } from '../../entities/invoice-master.entity';
import { UserMain } from '../../entities/user-main.entity';
import * as ExcelJS from 'exceljs';
import { stringify } from 'csv-stringify/sync';

/**
 * DataExportService
 *
 * Exports database data to CSV or Excel format with custom filters.
 */
@Injectable()
export class DataExportService {
  private readonly logger = new Logger(DataExportService.name);

  constructor(
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(InvoiceMaster)
    private invoiceRepository: Repository<InvoiceMaster>,
    @InjectRepository(UserMain)
    private userRepository: Repository<UserMain>,
  ) { }

  /**
   * Export to CSV
   */
  async exportToCsv(
    entityType: 'products' | 'customers' | 'invoices' | 'users',
    filters?: {
      startDate?: Date;
      endDate?: Date;
      fields?: string[];
    },
  ): Promise<string> {
    try {
      this.logger.log(`Exporting ${entityType} to CSV`);

      let data: any[];

      switch (entityType) {
        case 'products':
          data = await this.getProducts(filters);
          break;
        case 'customers':
          data = await this.getCustomers(filters);
          break;
        case 'invoices':
          data = await this.getInvoices(filters);
          break;
        case 'users':
          data = await this.getUsers(filters);
          break;
      }

      // Filter fields if specified
      if (filters?.fields && filters.fields.length > 0) {
        data = data.map((row) => {
          const filtered: any = {};
          filters.fields!.forEach((field) => {
            if (field in row) {
              filtered[field] = row[field];
            }
          });
          return filtered;
        });
      }

      // Convert to CSV
      const csv = stringify(data, {
        header: true,
        columns: filters?.fields,
      });

      this.logger.log(`Exported ${data.length} rows to CSV`);
      return csv;
    } catch (error) {
      this.logger.error('Failed to export to CSV:', error);
      throw error;
    }
  }

  /**
   * Export to Excel
   */
  async exportToExcel(
    entityType: 'products' | 'customers' | 'invoices' | 'users',
    filters?: {
      startDate?: Date;
      endDate?: Date;
      fields?: string[];
    },
  ): Promise<Buffer> {
    try {
      this.logger.log(`Exporting ${entityType} to Excel`);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        entityType.charAt(0).toUpperCase() + entityType.slice(1),
      );

      let data: any[];

      switch (entityType) {
        case 'products':
          data = await this.getProducts(filters);
          break;
        case 'customers':
          data = await this.getCustomers(filters);
          break;
        case 'invoices':
          data = await this.getInvoices(filters);
          break;
        case 'users':
          data = await this.getUsers(filters);
          break;
      }

      if (data.length === 0) {
        throw new Error('No data to export');
      }

      // Filter fields if specified
      let finalData = data;
      if (filters?.fields && filters.fields.length > 0) {
        finalData = data.map((row) => {
          const filtered: any = {};
          filters.fields!.forEach((field) => {
            if (field in row) {
              filtered[field] = row[field];
            }
          });
          return filtered;
        });
      }

      // Add headers
      const headers = Object.keys(finalData[0]);
      worksheet.addRow(headers);

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      };

      // Add data rows
      finalData.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        if (!column) return;
        let maxLength = 0;
        column.eachCell!({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 10;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = Math.min(maxLength + 2, 50);
      });

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      this.logger.log(`Exported ${data.length} rows to Excel`);
      return Buffer.from(buffer);
    } catch (error) {
      this.logger.error('Failed to export to Excel:', error);
      throw error;
    }
  }

  /**
   * Get Products with Filters
   */
  private async getProducts(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory');

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.where({
        created_at: Between(filters.startDate, filters.endDate),
      });
    }

    const products = await queryBuilder.getMany();

    return products.map((p) => ({
      id: p.id,
      name: p.description || p.sku, // Mapped name to description
      price: p.unit_price, // Mapped price to unit_price
      stock: p.quantity, // Mapped stock to quantity
      description: p.description || '',
      createdAt: p.created_at,
    }));
  }

  /**
   * Get Customers with Filters
   */
  private async getCustomers(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.where({
        createdAt: Between(filters.startDate, filters.endDate),
      });
    }

    const customers = await queryBuilder.getMany();

    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt,
    }));
  }

  /**
   * Get Invoices with Filters
   */
  private async getInvoices(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice');

    // Relations are complex in InvoiceMaster, simplify for export
    // .leftJoinAndSelect('invoice.customer', 'customer');

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.where({
        created_at: Between(filters.startDate, filters.endDate),
      });
    }

    const invoices = await queryBuilder.getMany();

    return invoices.map((i) => ({
      id: i.id,
      invoiceNumber: i.invoice_number,
      total: i.total_amount,
      status: i.status,
      createdAt: i.created_at,
    }));
  }

  /**
   * Get Users with Filters
   */
  private async getUsers(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.where({
        created_at: Between(filters.startDate, filters.endDate),
      });
    }

    const users = await queryBuilder.getMany();

    return users.map((u) => ({
      id: u.id,
      contactPerson: u.contact_person,
      email: u.email,
      role: u.role,
      status: u.status,
    }));
  }

  /**
   * Export Multiple Entities to Excel
   */
  async exportMultipleToExcel(
    entities: Array<'products' | 'customers' | 'invoices' | 'users'>,
  ): Promise<Buffer> {
    try {
      this.logger.log(
        `Exporting multiple entities to Excel: ${entities.join(', ')}`,
      );

      const workbook = new ExcelJS.Workbook();

      for (const entityType of entities) {
        const worksheet = workbook.addWorksheet(
          entityType.charAt(0).toUpperCase() + entityType.slice(1),
        );

        let data: any[];

        switch (entityType) {
          case 'products':
            data = await this.getProducts();
            break;
          case 'customers':
            data = await this.getCustomers();
            break;
          case 'invoices':
            data = await this.getInvoices();
            break;
          case 'users':
            data = await this.getUsers();
            break;
        }

        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          worksheet.addRow(headers);

          worksheet.getRow(1).font = { bold: true };
          worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' },
          };

          data.forEach((row) => {
            worksheet.addRow(Object.values(row));
          });

          worksheet.columns.forEach((column) => {
            if (!column) return;
            let maxLength = 0;
            column.eachCell!({ includeEmpty: true }, (cell) => {
              const cellLength = cell.value ? cell.value.toString().length : 10;
              if (cellLength > maxLength) {
                maxLength = cellLength;
              }
            });
            column.width = Math.min(maxLength + 2, 50);
          });
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      this.logger.log('Multi-entity export complete');

      return Buffer.from(buffer);
    } catch (error) {
      this.logger.error('Failed to export multiple entities:', error);
      throw error;
    }
  }
}
