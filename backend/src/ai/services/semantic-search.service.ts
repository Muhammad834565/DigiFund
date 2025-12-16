import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMaster } from '../../entities/inventory-master.entity';
import { ProductEmbedding } from '../../entities/product-embedding.entity';
import { OpenRouterService } from './open-router.service';
import { SemanticSearchResult } from '../dto/ai-types';

@Injectable()
export class SemanticSearchService {
  private readonly logger = new Logger(SemanticSearchService.name);

  constructor(
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(ProductEmbedding)
    private embeddingRepository: Repository<ProductEmbedding>,
    private openRouterService: OpenRouterService,
  ) { }

  /**
   * Index Product for Search
   */
  async indexProduct(product: InventoryMaster): Promise<void> {
    try {
      this.logger.log(`Indexing product: ${product.name}`);

      // Create searchable text from product data
      const searchText = this.createSearchText(product);

      // FREE TEXT-BASED INDEXING (No API calls, no costs)
      // Store searchable text instead of embeddings
      const embedding = this.createTextEmbedding(searchText);

      // Check if embedding already exists
      const existing = await this.embeddingRepository.findOne({
        where: { productId: String(product.id) },
      });

      // ... (code omitted for brevity, logic remains same)

      if (existing) {
        existing.embedding = embedding;
        existing.embeddedText = searchText;
        await this.embeddingRepository.save(existing);
      } else {
        // Create new embedding
        const productEmbedding = this.embeddingRepository.create({
          productId: String(product.id),
          embedding,
          embeddedText: searchText,
        });
        await this.embeddingRepository.save(productEmbedding);
      }

      this.logger.log(`Product indexed successfully: ${product.id}`);
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}:`, error);
      throw error;
    }
  }

  /**
   * Search Products by Natural Language
   */
  async searchProducts(
    query: string,
    limit: number = 10,
  ): Promise<SemanticSearchResult[]> {
    try {
      this.logger.log(`Searching for: "${query}"`);

      // FREE TEXT-BASED SEARCH (No API calls)
      // Get all product embeddings (which now contain searchable text)
      const allEmbeddings = await this.embeddingRepository.find();

      if (allEmbeddings.length === 0) {
        this.logger.warn(
          'No product embeddings found. Please index products first.',
        );
        return [];
      }

      // Calculate text similarity for each product
      const scoredProducts = allEmbeddings.map((embedding) => ({
        productId: embedding.productId,
        similarity: this.calculateTextSimilarity(
          query.toLowerCase(),
          embedding.embeddedText.toLowerCase(),
        ),
      }));

      // Sort by similarity (highest first)
      scoredProducts.sort((a, b) => b.similarity - a.similarity);

      // Get top matches
      const topMatches = scoredProducts.slice(0, limit);

      // Fetch full product details
      const results: SemanticSearchResult[] = [];

      for (const match of topMatches) {
        const product = await this.inventoryRepository.findOne({
          where: { id: Number(match.productId) }, // Assuming ID is number
        });

        if (product) {
          results.push({
            id: String(product.id),
            name: product.name,
            description: product.description || '',
            price: product.unit_price,
            stock: product.quantity,
            similarityScore: match.similarity,
          });
        }
      }

      this.logger.log(`Found ${results.length} matching products`);
      return results;
    } catch (error) {
      this.logger.error('Search failed:', error);
      throw error;
    }
  }

  /**
   * Index All Products
   */
  async indexAllProducts(): Promise<number> {
    try {
      this.logger.log('Indexing all products...');

      const products = await this.inventoryRepository.find();
      let indexed = 0;

      for (const product of products) {
        try {
          await this.indexProduct(product);
          indexed++;
        } catch (error) {
          this.logger.error(`Failed to index product ${product.id}:`, error);
        }
      }

      this.logger.log(`Indexed ${indexed} of ${products.length} products`);
      return indexed;
    } catch (error) {
      this.logger.error('Failed to index products:', error);
      throw error;
    }
  }

  /**
   * Create Search Text
   */
  private createSearchText(product: InventoryMaster): string {
    const parts = [
      `Product: ${product.name}`,
      product.description ? `Description: ${product.description}` : '',
      `Price: $${product.unit_price}`,
      product.quantity > 0 ? 'In stock' : 'Out of stock',
    ];

    return parts.filter((p) => p).join('. ');
  }

  /**
   * Get Similar Products
   */
  async getSimilarProducts(
    productId: string,
    limit: number = 5,
  ): Promise<SemanticSearchResult[]> {
    try {
      // Support both ID formats if needed
      let product;
      if (!isNaN(Number(productId))) {
        product = await this.inventoryRepository.findOne({ where: { id: Number(productId) } });
      } else {
        product = await this.inventoryRepository.findOne({ where: { inventory_id: productId } });
      }

      if (!product) {
        throw new Error('Product not found');
      }

      // Use product name and description as search query
      const searchQuery = this.createSearchText(product);

      // Search, but exclude the original product
      const results = await this.searchProducts(searchQuery, limit + 1);

      return results.filter((r) => r.id !== String(product.id)).slice(0, limit);
    } catch (error) {
      this.logger.error('Failed to get similar products:', error);
      throw error;
    }
  }

  /**
   * Create Text Embedding (Free Alternative)
   * Creates a simple numeric representation of text for storage
   */
  private createTextEmbedding(text: string): number[] {
    // Create a simple hash-based embedding (deterministic, no API calls)
    // This is just for storage compatibility - we use text matching for search
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0); // Standard embedding size

    words.forEach((word, index) => {
      const hash = this.simpleHash(word);
      embedding[hash % 384] += 1;
    });

    return embedding;
  }

  /**
   * Calculate Text Similarity (Free Alternative)
   * Uses keyword matching instead of semantic understanding
   */
  private calculateTextSimilarity(query: string, productText: string): number {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const productWords = productText.toLowerCase().split(/\s+/);

    if (queryWords.length === 0) return 0;

    let score = 0;

    // Exact word matches (highest weight)
    queryWords.forEach(qWord => {
      if (productWords.includes(qWord)) {
        score += 1.0;
      }
    });

    // Partial matches (medium weight)
    queryWords.forEach(qWord => {
      productWords.forEach(pWord => {
        if (pWord.includes(qWord) || qWord.includes(pWord)) {
          score += 0.5;
        }
      });
    });

    // Normalize score
    return score / queryWords.length;
  }

  /**
   * Simple Hash Function
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
