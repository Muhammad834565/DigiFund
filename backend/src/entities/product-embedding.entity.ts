import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * ProductEmbedding Entity
 *
 * This entity stores vector embeddings for products to enable semantic search.
 * Embeddings are numerical representations of product data that capture semantic meaning.
 *
 * Vector embeddings allow us to:
 * 1. Find similar products based on meaning, not just keywords
 * 2. Perform natural language search
 * 3. Build recommendation systems
 */
@Entity('product_embeddings')
export class ProductEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference to the product
  @Column()
  productId: string;

  // Vector embedding (768 dimensions for Gemini embeddings)
  // Stored as a simple array in PostgreSQL with pgvector extension
  @Column('float', { array: true })
  embedding: number[];

  // Text that was embedded (for reference)
  @Column('text')
  embeddedText: string;

  @CreateDateColumn()
  createdAt: Date;
}
