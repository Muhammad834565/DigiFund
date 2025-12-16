import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';

/**
 * Input for Semantic Search
 * User provides a natural language query to search products
 */
@InputType()
export class SemanticSearchInput {
  @Field()
  @IsString()
  query: string; // Natural language query like "cheap electronic gadgets"

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number; // Maximum number of results
}

/**
 * Input for Product Recommendations
 * Get recommendations based on user's purchase history
 */
@InputType()
export class RecommendationInput {
  @Field()
  @IsString()
  userId: string; // User ID to get recommendations for

  @Field(() => Int, { defaultValue: 5 })
  @IsInt()
  @Min(1)
  @Max(20)
  limit: number;
}

/**
 * Input for Generating Product Summary
 */
@InputType()
export class GenerateSummaryInput {
  @Field()
  @IsString()
  productId: string;
}

/**
 * Input for RAG Query
 * User asks a question about their data
 */
@InputType()
export class RagQueryInput {
  @Field()
  @IsString()
  query: string; // Natural language question about the database

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  context?: string; // Optional context for better answers
}

/**
 * Input for Data Export
 */
@InputType()
export class DataExportInput {
  @Field()
  @IsEnum(['products', 'customers', 'invoices', 'users'])
  dataType: string; // What data to export

  @Field()
  @IsEnum(['csv', 'excel'])
  format: string; // Export format

  @Field({ nullable: true })
  @IsOptional()
  dateFrom?: Date;

  @Field({ nullable: true })
  @IsOptional()
  dateTo?: Date;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  fields?: string[]; // Specific fields to export
}
