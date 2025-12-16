import { ObjectType, Field, Float, Int, ID } from '@nestjs/graphql';

/**
 * GraphQL Type for Semantic Search Results
 *
 * Returns products found through natural language search
 * with similarity scores showing how well they match the query
 */
@ObjectType()
export class SemanticSearchResult {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  // Similarity score (0-1, higher = more similar)
  @Field(() => Float)
  similarityScore: number;
}

/**
 * GraphQL Type for Product Recommendations
 */
@ObjectType()
export class ProductRecommendation {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  // Confidence score for recommendation
  @Field(() => Float)
  confidence: number;

  // Reason for recommendation
  @Field()
  reason: string;
}

/**
 * GraphQL Type for AI-Generated Product Summary
 */
@ObjectType()
export class ProductSummary {
  @Field(() => ID)
  productId: string;

  @Field()
  summary: string;

  @Field(() => [String])
  keyFeatures: string[];

  @Field()
  targetAudience: string;
}

/**
 * GraphQL Type for CSV Upload Result
 */
@ObjectType()
export class CsvUploadResult {
  @Field(() => Int)
  totalRows: number;

  @Field(() => Int)
  successfulRows: number;

  @Field(() => Int)
  failedRows: number;

  @Field(() => [String])
  errors: string[];

  @Field()
  message: string;
}

/**
 * GraphQL Type for RAG Response
 */
@ObjectType()
export class RagResponse {
  @Field()
  answer: string;

  @Field(() => [String])
  sources: string[]; // Which database tables were queried

  @Field(() => Int)
  confidenceScore: number; // 0-100

  @Field(() => [String], { nullable: true })
  followUpSuggestions: string[];
}

/**
 * GraphQL Type for Anomaly Detection Result
 */
@ObjectType()
export class AnomalyDetectionResult {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  productId: string;

  @Field()
  productName: string;

  @Field()
  anomalyType: string;

  @Field()
  description: string;

  @Field(() => Float)
  anomalyScore: number;

  @Field()
  detectedAt: Date;
}

/**
 * GraphQL Type for Data Export Result
 */
@ObjectType()
export class DataExportResult {
  @Field()
  fileName: string;

  @Field()
  fileUrl: string;

  @Field(() => Int)
  recordCount: number;

  @Field()
  format: string; // 'csv' or 'excel'
}
