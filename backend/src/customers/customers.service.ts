import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Customer } from '../entities/customer.entity';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Get all customers for a specific user
  async findAll(userPublicId: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { owner_public_id: userPublicId },
    });
  }

  // Get one customer by ID for a specific user
  async findById(
    id: string,
    userPublicId: string,
  ): Promise<Customer | undefined> {
    const customer = await this.customerRepository.findOne({
      where: { id, owner_public_id: userPublicId },
    });
    return customer ?? undefined;
  }

  // Updated create() method to save to database
  async create(
    input: CreateCustomerInput,
    userPublicId: string,
  ): Promise<Customer> {
    if (!input.name) {
      throw new BadRequestException('Customer name is required');
    }

    // Check if email already exists for this user
    if (input.email) {
      const existingCustomerWithEmail = await this.customerRepository.findOne({
        where: { email: input.email, owner_public_id: userPublicId },
      });
      if (existingCustomerWithEmail) {
        throw new ConflictException(
          'Email is already used by another customer',
        );
      }
    }

    // Check if phone already exists for this user
    if (input.phone) {
      const existingCustomerWithPhone = await this.customerRepository.findOne({
        where: { phone: input.phone, owner_public_id: userPublicId },
      });
      if (existingCustomerWithPhone) {
        throw new ConflictException(
          'Phone number is already used by another customer',
        );
      }
    }

    const newCustomer = this.customerRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      owner_public_id: userPublicId,
    });
    return this.customerRepository.save(newCustomer);
  }

  // Update customer
  async update(
    id: string,
    input: UpdateCustomerInput,
    userPublicId: string,
  ): Promise<Customer | undefined> {
    const customer = await this.findById(id, userPublicId);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    // Check if new email is already used by another customer of this user
    if (input.email && input.email !== customer.email) {
      const existingCustomerWithEmail = await this.customerRepository.findOne({
        where: {
          email: input.email,
          owner_public_id: userPublicId,
          id: Not(id), // Exclude current customer from check
        },
      });
      if (existingCustomerWithEmail) {
        throw new ConflictException(
          'Email is already used by another customer',
        );
      }
    }

    // Check if new phone is already used by another customer of this user
    if (input.phone && input.phone !== customer.phone) {
      const existingCustomerWithPhone = await this.customerRepository.findOne({
        where: {
          phone: input.phone,
          owner_public_id: userPublicId,
          id: Not(id), // Exclude current customer from check
        },
      });
      if (existingCustomerWithPhone) {
        throw new ConflictException(
          'Phone number is already used by another customer',
        );
      }
    }

    await this.customerRepository.update(id, input);
    return this.findById(id, userPublicId);
  }

  // Delete customer
  async delete(id: string, userPublicId: string): Promise<boolean> {
    const customer = await this.findById(id, userPublicId);
    if (!customer) {
      return false;
    }
    const result = await this.customerRepository.delete(id);
    return result.affected !== 0;
  }
}
