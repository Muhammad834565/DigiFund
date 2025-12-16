import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { GraphQLContext } from '../auth/types/auth.types';
import { CustomersService } from './customers.service';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  // Get all customers for authenticated user
  @Query(() => [Customer], { name: 'customers' })
  @UseGuards(JwtAuthGuard)
  async getAllCustomers(
    @Context() context: GraphQLContext,
  ): Promise<Customer[]> {
    const user = context.req.user;
    return await this.customersService.findAll(user.public_id);
  }

  // Get single customer by ID for authenticated user
  @Query(() => Customer, { name: 'customer' })
  @UseGuards(JwtAuthGuard)
  async getCustomer(
    @Args('id') id: string,
    @Context() context: GraphQLContext,
  ): Promise<Customer> {
    const user = context.req.user;
    const customer = await this.customersService.findById(id, user.public_id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  // Create a new customer for authenticated user
  @Mutation(() => Customer, { name: 'createCustomer' })
  @UseGuards(JwtAuthGuard)
  async createCustomer(
    @Args('input') input: CreateCustomerInput,
    @Context() context: GraphQLContext,
  ): Promise<Customer> {
    try {
      const user = context.req.user;
      return await this.customersService.create(input, user.public_id);
    } catch (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // Update an existing customer for authenticated user
  @Mutation(() => Customer, { name: 'updateCustomer' })
  @UseGuards(JwtAuthGuard)
  async updateCustomer(
    @Args('id') id: string,
    @Args('input') input: UpdateCustomerInput,
    @Context() context: GraphQLContext,
  ): Promise<Customer> {
    const user = context.req.user;
    const updatedCustomer = await this.customersService.update(
      id,
      input,
      user.public_id,
    );
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return updatedCustomer;
  }

  // Delete a customer for authenticated user
  @Mutation(() => Boolean, { name: 'deleteCustomer' })
  @UseGuards(JwtAuthGuard)
  async deleteCustomer(
    @Args('id') id: string,
    @Context() context: GraphQLContext,
  ): Promise<boolean> {
    const user = context.req.user;
    const result = await this.customersService.delete(id, user.public_id);
    if (!result) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return result;
  }
}
