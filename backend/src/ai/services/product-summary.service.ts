import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMaster } from '../../entities/inventory-master.entity';
import { OpenRouterService } from './open-router.service';
import { ProductSummary } from '../dto/ai-types';

@Injectable()
export class ProductSummaryService {
  private readonly logger = new Logger(ProductSummaryService.name);

  constructor(
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    private openRouterService: OpenRouterService,
  ) { }

  /**
   * Generate Product Summary
   */
  async generateProductSummary(productId: string): Promise<ProductSummary> {
    try {
      // productId arg might be inventory ID string or number depending on callers
      // InventoryMaster id is number. If productId is string, might need parsing or using inventory_id
      // Assuming productId matches id (number) for now, or finding by inventory_id
      this.logger.log(`Generating summary for product: ${productId}`);

      let product;
      // Try ID as number
      if (!isNaN(Number(productId))) {
        product = await this.inventoryRepository.findOne({
          where: { id: Number(productId) },
        });
      } else {
        product = await this.inventoryRepository.findOne({
          where: { inventory_id: productId },
        });
      }

      if (!product) {
        throw new Error('Product not found');
      }

      // Create prompt for AI
      const prompt = this.createSummaryPrompt(product);

      // Define expected JSON schema
      const schema = `{
  "summary": "string - A compelling 2-3 sentence product description",
  "keyFeatures": ["array of 3-5 key features or benefits"],
  "targetAudience": "string - Who this product is for"
}`;

      // Get structured response from OpenRouter
      let aiResponse;
      try {
        aiResponse = await this.openRouterService.generateStructuredResponse<{
          summary: string;
          keyFeatures: string[];
          targetAudience: string;
        }>(prompt, schema);
      } catch (err) {
        this.logger.warn('AI summary generation failed, using fallback:', err.message);
        // Fallback to basic generation
        aiResponse = {
          summary: product.description || `A high-quality ${product.name} available for purchase.`,
          keyFeatures: [
            `High quality ${product.name}`,
            `Affordable price: $${product.unit_price}`,
            product.quantity > 0 ? 'In stock and ready to ship' : 'Currently out of stock'
          ],
          targetAudience: 'General Customers'
        };
      }

      const result: ProductSummary = {
        productId: String(product.id),
        summary: aiResponse.summary,
        keyFeatures: aiResponse.keyFeatures,
        targetAudience: aiResponse.targetAudience,
      };

      this.logger.log('Summary generated successfully');
      return result;
    } catch (error) {
      this.logger.error('Failed to generate summary:', error);
      throw error;
    }
  }

  /**
   * Generate and Save Summary
   */
  async generateAndSaveSummary(productId: string): Promise<InventoryMaster> {
    try {
      const summary = await this.generateProductSummary(productId);

      let product;
      if (!isNaN(Number(productId))) {
        product = await this.inventoryRepository.findOne({ where: { id: Number(productId) } });
      } else {
        product = await this.inventoryRepository.findOne({ where: { inventory_id: productId } });
      }

      if (!product) {
        throw new Error('Product not found');
      }

      // Combine summary and features into description
      const fullDescription = [
        summary.summary,
        '',
        'Key Features:',
        ...summary.keyFeatures.map((f) => `• ${f}`),
        '',
        `Perfect for: ${summary.targetAudience}`,
      ].join('\n');

      product.description = fullDescription;

      return this.inventoryRepository.save(product);
    } catch (error) {
      this.logger.error('Failed to generate and save summary:', error);
      throw error;
    }
  }

  /**
   * Batch Generate Summaries
   */
  async generateMissingSummaries(): Promise<number> {
    try {
      this.logger.log('Generating summaries for products without descriptions');

      const products = await this.inventoryRepository.find();
      const productsNeedingSummaries = products.filter(
        (p) => !p.description || p.description.trim().length < 10,
      );

      this.logger.log(
        `Found ${productsNeedingSummaries.length} products needing summaries`,
      );

      let generated = 0;

      for (const product of productsNeedingSummaries) {
        try {
          await this.generateAndSaveSummary(String(product.id));
          generated++;
          this.logger.log(
            `Generated summary ${generated}/${productsNeedingSummaries.length}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to generate summary for ${product.id}:`,
            error,
          );
        }
      }

      this.logger.log(`Generated ${generated} summaries`);
      return generated;
    } catch (error) {
      this.logger.error('Failed to batch generate summaries:', error);
      throw error;
    }
  }

  /**
   * Create Summary Prompt
   */
  private createSummaryPrompt(product: InventoryMaster): string {
    return `You are a professional e-commerce product description writer.

Product Information:
- Name: ${product.name}
- Price: $${product.unit_price}
- Stock: ${product.quantity > 0 ? 'Available' : 'Out of stock'}
${product.description ? `- Existing description: ${product.description}` : ''}

Task: Create a compelling product summary that will help sell this product.

Requirements:
1. Write a 2-3 sentence summary that highlights the product's value
2. List 3-5 key features or benefits
3. Identify the target audience (who would buy this)

Make it persuasive and informative. Focus on benefits, not just features.`;
  }
}
