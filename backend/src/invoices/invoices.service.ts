import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvoiceMaster,
  InvoiceItem,
  InvoiceType,
} from '../entities/invoice-master.entity';
import { UserMain } from '../entities/user-main.entity';
import { CreateInvoiceInput } from './dto/create-invoice.input';

import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceMaster)
    private invoiceRepository: Repository<InvoiceMaster>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(UserMain)
    private userRepository: Repository<UserMain>,
    private inventoryService: InventoryService,
  ) { }

  async create(input: CreateInvoiceInput, creatorPublicId: string) {
    // Find bill_to user by public_id, email, or phone
    let billToUser: UserMain | null = null;

    if (input.bill_to_public_id) {
      billToUser = await this.userRepository.findOne({
        where: { public_id: input.bill_to_public_id as string },
      });
    } else if (input.bill_to_email) {
      billToUser = await this.userRepository.findOne({
        where: { email: input.bill_to_email as string },
      });
    } else if (input.bill_to_phone) {
      billToUser = await this.userRepository.findOne({
        where: { phone_no: input.bill_to_phone },
      });
    } else {
      throw new BadRequestException(
        'Must provide bill_to_public_id, bill_to_email, or bill_to_phone',
      );
    }

    if (!billToUser) {
      throw new NotFoundException('Bill-to user not found');
    }

    // Find creator
    const creator = await this.userRepository.findOne({
      where: { public_id: creatorPublicId },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Generate invoice number (simple auto-increment, can be improved)
    const invoiceNumber = `INV-${Date.now()}`;

    // Calculate total amount from items and deduct stock
    let totalAmount = 0;
    for (const item of input.items) {
      const itemTotal = item.qty * item.rate;
      const discount = item.discount_percentage
        ? (itemTotal * item.discount_percentage) / 100
        : 0;
      totalAmount += itemTotal - discount;

      // Deduct stock
      await this.inventoryService.decreaseStock(
        item.inventory_id,
        item.qty,
        creatorPublicId,
      );
    }

    // Create invoice with INCOME type (creator's perspective)
    const invoice = this.invoiceRepository.create({
      invoice_number: invoiceNumber,
      invoice_type: InvoiceType.INCOME, // Always income for creator
      bill_from_public_id: creatorPublicId,
      bill_to_public_id: billToUser.public_id,
      bill_from_status: 'waiting',
      bill_to_status: 'pending',
      invoice_date: new Date(),
      total_amount: totalAmount,
      bill_from_name: creator.company_name || creator.contact_person,
      bill_from_address: creator.address,
      bill_from_email: creator.email,
      bill_from_phone: creator.phone_no,
      bill_to_name: billToUser.company_name || billToUser.contact_person,
      bill_to_address: billToUser.address,
      bill_to_email: billToUser.email,
      bill_to_phone: billToUser.phone_no,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Create invoice items
    const items = input.items.map((item) => {
      const itemTotal = item.qty * item.rate;
      const discount = item.discount_percentage
        ? (itemTotal * item.discount_percentage) / 100
        : 0;

      return this.invoiceItemRepository.create({
        invoice_id: savedInvoice.id,
        inventory_id: item.inventory_id,
        qty: item.qty,
        rate: item.rate,
        discount_percentage: item.discount_percentage || 0,
        total_price: itemTotal - discount,
      });
    });

    await this.invoiceItemRepository.save(items);

    return this.invoiceRepository.findOne({
      where: { id: savedInvoice.id },
      relations: ['items'],
    });
  }

  findAll() {
    return this.invoiceRepository.find({ relations: ['items'] });
  }

  async findByUser(userPublicId: string) {
    // Return invoices where user is either bill_from or bill_to
    return await this.invoiceRepository.find({
      where: [
        { bill_from_public_id: userPublicId },
        { bill_to_public_id: userPublicId },
      ],
      relations: ['items'],
    });
  }

  findOne(id: number) {
    return this.invoiceRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async findByInvoiceNumber(invoiceNumber: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoice_number: invoiceNumber },
      relations: ['items'],
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with number ${invoiceNumber} not found`,
      );
    }

    return invoice;
  }

  async updateStatus(
    invoiceNumber: string,
    status: string,
    userPublicId: string,
  ) {
    const invoice = await this.findByInvoiceNumber(invoiceNumber);

    // Check if user has access to this invoice
    if (
      invoice.bill_from_public_id !== userPublicId &&
      invoice.bill_to_public_id !== userPublicId
    ) {
      throw new BadRequestException('You do not have access to this invoice');
    }

    // PERMISSION LOGIC
    if (invoice.bill_from_public_id === userPublicId) {
      // BILL FROM: Can ONLY change to 'paid'
      if (status !== 'paid') {
        throw new BadRequestException(
          'As the sender, you can only mark the invoice as "paid".',
        );
      }
      invoice.bill_from_status = status;
      // If setting to paid, we might want to ensure it was approved first?
      // For now, assuming direct control.
    } else if (invoice.bill_to_public_id === userPublicId) {
      // BILL TO: Can ONLY change to 'approved' or 'declined'
      if (status !== 'approved' && status !== 'declined') {
        throw new BadRequestException(
          'As the receiver, you can only "approve" or "decline" the invoice.',
        );
      }
      invoice.bill_to_status = status;
    }

    // Update overall status logic
    // If Bill From says Paid -> Overall Paid
    if (invoice.bill_from_status === 'paid') {
      invoice.status = 'paid';
    } else if (
      invoice.bill_to_status === 'approved'
      // Maybe we wait for sender to also approve? But sender doesn't approve.
      // If Sender created it, they implied approval.
      // So if Receiver approves, it is Approved.
    ) {
      invoice.status = 'approved';
    } else if (
      invoice.bill_to_status === 'declined'
    ) {
      invoice.status = 'declined';
    } else {
      // Keep previous or waiting
    }

    return await this.invoiceRepository.save(invoice);
  }

  async update(invoiceNumber: string, updateInput: any, userPublicId: string) {
    // Fetch invoice WITHOUT items relation to avoid cascade issues
    const invoice = await this.invoiceRepository.findOne({
      where: { invoice_number: invoiceNumber },
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with number ${invoiceNumber} not found`,
      );
    }

    // PERMISSION CHECK: ONLY Bill From
    if (invoice.bill_from_public_id !== userPublicId) {
      throw new BadRequestException('Only the invoice sender can edit the invoice');
    }

    // Update notes if provided
    if (updateInput.notes !== undefined) {
      // Note: The entity doesn't have notes field yet ofc, logic remains same
    }

    // Update items if provided
    if (updateInput.items && updateInput.items.length > 0) {
      // Delete old items
      await this.invoiceItemRepository.delete({ invoice_id: invoice.id });

      // Calculate new total and prepare items
      let totalAmount = 0;
      const itemsToInsert: any[] = [];

      for (const item of updateInput.items) {
        const itemTotal = item.qty * item.rate;
        const discount = item.discount_percentage
          ? (itemTotal * item.discount_percentage) / 100
          : 0;
        totalAmount += itemTotal - discount;

        itemsToInsert.push({
          invoice_id: invoice.id,
          inventory_id: item.inventory_id,
          qty: item.qty,
          rate: item.rate,
          discount_percentage: item.discount_percentage || 0,
          total_price: itemTotal - discount,
        });

        // Note: update does NOT verify inventory stock again in this simple scope.
        // Ideally, we should verify stock availability or adjust deduction.
        // Since we don't track *previous* qty easily here without more logic, 
        // we are skipping deduction adjustment for now to avoid errors.
      }

      // Insert new items using insert instead of save
      await this.invoiceItemRepository.insert(itemsToInsert);

      // Update total amount
      invoice.total_amount = totalAmount;
    }

    await this.invoiceRepository.save(invoice);

    // Return invoice with items
    return this.findByInvoiceNumber(invoiceNumber);
  }

  async remove(invoiceNumber: string, userPublicId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoice_number: invoiceNumber },
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with number ${invoiceNumber} not found`,
      );
    }

    // PERMISSION CHECK: ONLY Bill From
    if (invoice.bill_from_public_id !== userPublicId) {
      throw new BadRequestException('Only the invoice sender can delete the invoice');
    }

    // Check if invoice is approved
    if (
      invoice.status === 'approved' ||
      invoice.bill_to_status === 'approved' ||
      invoice.status === 'paid'
    ) {
      throw new BadRequestException(
        'Cannot delete an approved/paid invoice.',
      );
    }

    await this.invoiceRepository.remove(invoice);
    return invoice;
  }
}
