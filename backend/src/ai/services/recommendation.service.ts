import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMaster } from '../../entities/inventory-master.entity';
import { ProductEmbedding } from '../../entities/product-embedding.entity';
import { OpenRouterService } from './open-router.service';
import { ProductRecommendation } from '../dto/ai-types';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(ProductEmbedding)
    private embeddingRepository: Repository<ProductEmbedding>,
    private openRouterService: OpenRouterService,
  ) { }

  /**
   * Get Recommendations for User
   */
  async getRecommendationsForUser(
    userId: string,
    limit: number = 5,
  ): Promise<ProductRecommendation[]> {
    try {
      this.logger.log(`Getting recommendations for user: ${userId}`);

      // For now, return popular products
      return this.getPopularProducts(limit);
    } catch (error) {
      this.logger.error('Failed to get recommendations:', error);
      throw error;
    }
  }

  /**
   * Get Popular Products
   */
  private async getPopularProducts(
    limit: number,
  ): Promise<ProductRecommendation[]> {
    const products = await this.inventoryRepository.find({
      take: limit,
      order: { created_at: 'DESC' },
    });

    return products.map((product) => ({
      id: String(product.id),
      name: product.name,
      description: product.description || 'No description available',
      price: Number(product.unit_price),
      stock: product.quantity,
      confidence: 0.7,
      reason: 'Popular product',
    }));
  }
}
