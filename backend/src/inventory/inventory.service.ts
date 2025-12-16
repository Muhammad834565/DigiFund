import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMaster } from '../entities/inventory-master.entity';
import { UserMain } from '../entities/user-main.entity';
import {
  CreateInventoryInput,
  UpdateInventoryInput,
} from '../common/dto/inventory.input';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(UserMain)
    private userRepository: Repository<UserMain>,
  ) { }

  /**
   * Upsert: Update if SKU exists, otherwise create new
   */
  async upsert(input: CreateInventoryInput, userPublicId: string) {
    // Check if SKU exists for this user
    let inventory: InventoryMaster | null = null;

    if (input.sku) {
      inventory = await this.inventoryRepository.findOne({
        where: {
          sku: input.sku,
          owner_public_id: userPublicId,
        },
      });
    }

    if (inventory) {
      // Update existing
      inventory.name = input.name;
      inventory.description = input.description;
      inventory.quantity = input.quantity;
      inventory.unit_price = input.unit_price;
      inventory.price = input.unit_price * input.quantity; // Calculated
      if (input.images) {
        inventory.images = input.images;
      }

      return await this.inventoryRepository.save(inventory);
    } else {
      // Create new
      return await this.create(input, userPublicId);
    }
  }

  async create(input: CreateInventoryInput, userPublicId: string) {
    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { public_id: userPublicId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if SKU already exists for this user
    if (input.sku) {
      const existing = await this.inventoryRepository.findOne({
        where: { sku: input.sku, owner_public_id: userPublicId },
      });

      if (existing) {
        throw new BadRequestException(
          `Inventory item with SKU "${input.sku}" already exists`,
        );
      }
    }

    // Generate unique inventory_id
    const inventoryId = `INV-${Date.now()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`;

    const inventory = this.inventoryRepository.create({
      inventory_id: inventoryId,
      owner_public_id: userPublicId,
      name: input.name,
      description: input.description,
      price: input.unit_price * input.quantity, // Calculated
      quantity: input.quantity,
      unit_price: input.unit_price,
      sku: input.sku,
      images: input.images,
    });

    return await this.inventoryRepository.save(inventory);
  }

  async findAll(userPublicId: string) {
    return await this.inventoryRepository.find({
      where: { owner_public_id: userPublicId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(inventoryId: string, userPublicId: string) {
    const inventory = await this.inventoryRepository.findOne({
      where: { inventory_id: inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Inventory item with ID ${inventoryId} not found`,
      );
    }

    // Check ownership
    if (inventory.owner_public_id !== userPublicId) {
      throw new BadRequestException(
        'You do not have access to this inventory item',
      );
    }

    return inventory;
  }

  async update(
    inventoryId: string,
    input: UpdateInventoryInput,
    userPublicId: string,
  ) {
    const inventory = await this.findOne(inventoryId, userPublicId);

    // Update fields if provided
    if (input.name !== undefined) {
      inventory.name = input.name;
    }
    if (input.description !== undefined) {
      inventory.description = input.description;
    }
    // Price is always calculated based on qty * unit_price

    if (input.quantity !== undefined) {
      inventory.quantity = input.quantity;
    }
    if (input.unit_price !== undefined) {
      inventory.unit_price = input.unit_price;
    }

    // Recalculate price if either quantity or unit_price changed (or both)
    if (input.quantity !== undefined || input.unit_price !== undefined) {
      inventory.price = inventory.quantity * inventory.unit_price;
    }
    if (input.sku !== undefined) {
      // Check if new SKU conflicts with existing
      if (input.sku !== inventory.sku) {
        const existing = await this.inventoryRepository.findOne({
          where: { sku: input.sku, owner_public_id: userPublicId },
        });

        if (existing && existing.id !== inventory.id) {
          throw new BadRequestException(
            `Inventory item with SKU "${input.sku}" already exists`,
          );
        }
      }
      inventory.sku = input.sku;
    }
    if (input.images !== undefined) {
      inventory.images = input.images;
    }

    return await this.inventoryRepository.save(inventory);
  }

  async remove(inventoryId: string, userPublicId: string) {
    const inventory = await this.findOne(inventoryId, userPublicId);
    await this.inventoryRepository.remove(inventory);
    return inventory;
  }

  async decreaseStock(inventoryId: string, quantity: number, userPublicId: string) {
    const inventory = await this.findOne(inventoryId, userPublicId);

    if (inventory.quantity < quantity) {
      throw new BadRequestException(
        `Insufficient stock for item ${inventory.name}. Available: ${inventory.quantity}, Requested: ${quantity}`,
      );
    }

    inventory.quantity -= quantity;
    inventory.price = inventory.quantity * inventory.unit_price; // Recalculate total price

    return await this.inventoryRepository.save(inventory);
  }
}
