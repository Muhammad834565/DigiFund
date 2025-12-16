import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { GraphQLContext } from '../auth/types/auth.types';
import { InvoicesService } from './invoices.service';
import { InvoiceType } from './dto/invoice.type';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import {
  UpdateInvoiceStatusInput,
  UpdateInvoiceInput,
} from '../common/dto/invoice.input';
import { PubSub } from 'graphql-subscriptions';

// Standard PubSub instance
const pubSub = new PubSub();

@Resolver(() => InvoiceType)
export class InvoicesResolver {
  constructor(private readonly svc: InvoicesService) {}

  @Query(() => [InvoiceType])
  invoices() {
    return this.svc.findAll();
  }

  @Query(() => [InvoiceType])
  @UseGuards(JwtAuthGuard)
  getInvoices(@Context() context: GraphQLContext) {
    const user = context.req.user;
    return this.svc.findByUser(user.public_id);
  }

  @Query(() => InvoiceType)
  invoice(@Args('id', { type: () => Int }) id: number) {
    return this.svc.findOne(id);
  }

  @Query(() => InvoiceType)
  @UseGuards(JwtAuthGuard)
  getInvoiceByNumber(@Args('invoice_number') invoiceNumber: string) {
    return this.svc.findByInvoiceNumber(invoiceNumber);
  }

  @Mutation(() => InvoiceType)
  @UseGuards(JwtAuthGuard)
  async createInvoice(
    @Args('input') input: CreateInvoiceInput,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    const invoice = await this.svc.create(input, user.public_id);

    // Publish event for subscriptions
    await pubSub.publish('invoiceReceived', { invoiceReceived: invoice });

    return invoice;
  }

  @Mutation(() => InvoiceType)
  @UseGuards(JwtAuthGuard)
  async updateInvoiceStatus(
    @Args('input') input: UpdateInvoiceStatusInput,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    return await this.svc.updateStatus(
      input.invoice_number,
      input.status,
      user.public_id,
    );
  }

  @Mutation(() => InvoiceType)
  @UseGuards(JwtAuthGuard)
  async updateInvoice(
    @Args('invoice_number') invoiceNumber: string,
    @Args('input') input: UpdateInvoiceInput,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    return await this.svc.update(invoiceNumber, input, user.public_id);
  }

  @Mutation(() => InvoiceType)
  @UseGuards(JwtAuthGuard)
  async deleteInvoice(
    @Args('invoice_number') invoiceNumber: string,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    return this.svc.remove(invoiceNumber, user.public_id);
  }

  @Subscription(() => InvoiceType, {
    resolve: (payload: { invoiceReceived: InvoiceType }) =>
      payload.invoiceReceived,
  })
  invoiceReceived() {
    return pubSub.asyncIterableIterator('invoiceReceived');
  }
}
