import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { GraphQLContext } from '../auth/types/auth.types';
import { InventoryService } from './inventory.service';
import { InventoryMaster } from '../entities/inventory-master.entity';
import {
  CreateInventoryInput,
  UpdateInventoryInput,
} from '../common/dto/inventory.input';
import { MessageResponse } from '../common/dto/response.type';

@Resolver(() => InventoryMaster)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => InventoryMaster)
  @UseGuards(JwtAuthGuard)
  async createInventory(
    @Args('input') input: CreateInventoryInput,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    // Upsert: Update if SKU exists, otherwise create new
    return await this.inventoryService.upsert(input, user.public_id);
  }

  @Query(() => [InventoryMaster])
  @UseGuards(JwtAuthGuard)
  async getInventory(@Context() context: GraphQLContext) {
    const user = context.req.user;
    return await this.inventoryService.findAll(user.public_id);
  }

  @Query(() => InventoryMaster)
  @UseGuards(JwtAuthGuard)
  async getInventoryById(
    @Args('inventory_id') inventoryId: string,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    return await this.inventoryService.findOne(inventoryId, user.public_id);
  }

  @Mutation(() => InventoryMaster)
  @UseGuards(JwtAuthGuard)
  async updateInventory(
    @Args('inventory_id') inventoryId: string,
    @Args('input') input: UpdateInventoryInput,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    return await this.inventoryService.update(
      inventoryId,
      input,
      user.public_id,
    );
  }

  @Mutation(() => MessageResponse)
  @UseGuards(JwtAuthGuard)
  async deleteInventory(
    @Args('inventory_id') inventoryId: string,
    @Context() context: GraphQLContext,
  ): Promise<MessageResponse> {
    const user = context.req.user;
    await this.inventoryService.remove(inventoryId, user.public_id);
    return {
      message: `Inventory item ${inventoryId} deleted successfully`,
    };
  }
}
