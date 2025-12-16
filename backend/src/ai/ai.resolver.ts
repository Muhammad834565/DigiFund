import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SemanticSearchService } from './services/semantic-search.service';
import { RecommendationService } from './services/recommendation.service';
import { ProductSummaryService } from './services/product-summary.service';
import { RagService } from './services/rag.service';
import { CsvUploadService } from './services/csv-upload.service';
import { DataExportService } from './services/data-export.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import {
  SemanticSearchResult,
  ProductRecommendation,
  ProductSummary,
  RagResponse,
  AnomalyDetectionResult,
  DataExportResult,
  CsvUploadResult,
} from './dto/ai-types';
import {
  SemanticSearchInput,
  RecommendationInput,
  GenerateSummaryInput,
  RagQueryInput,
  DataExportInput,
} from './dto/ai-inputs';

/**
 * AIResolver
 *
 * GraphQL endpoints for all AI-powered features.
 *
 * ENDPOINTS PROVIDED:
 * 1. semanticSearch - Natural language product search
 * 2. getRecommendations - Personalized product recommendations
 * 3. generateProductSummary - AI-generated product descriptions
 * 4. queryWithRag - Ask questions about your database
 * 5. exportData - Export data to CSV/Excel
 * 6. detectAnomalies - Find unusual patterns in sales
 * 7. indexAllProducts - Prepare products for semantic search
 * 8. generateMissingSummaries - Batch generate summaries
 *
 * All endpoints are protected with JWT authentication.
 */
@Resolver()
@UseGuards(JwtAuthGuard)
export class AiResolver {
  constructor(
    private semanticSearchService: SemanticSearchService,
    private recommendationService: RecommendationService,
    private productSummaryService: ProductSummaryService,
    private ragService: RagService,
    private csvUploadService: CsvUploadService,
    private dataExportService: DataExportService,
    private anomalyDetectionService: AnomalyDetectionService,
  ) {}

  /**
   * Semantic Search
   *
   * Search products using natural language.
   *
   * EXAMPLE:
   * Input: "I need something for gaming on a budget"
   * Output: Gaming products sorted by relevance
   */
  @Query(() => [SemanticSearchResult], {
    description:
      'Search products using natural language. Returns products ranked by relevance.',
  })
  async semanticSearch(
    @Args('input') input: SemanticSearchInput,
  ): Promise<SemanticSearchResult[]> {
    return this.semanticSearchService.searchProducts(
      input.query,
      input.limit || 10,
    );
  }

  /**
   * Get Recommendations
   *
   * Get personalized product recommendations based on purchase history.
   */
  @Query(() => [ProductRecommendation], {
    description:
      'Get personalized product recommendations based on purchase history.',
  })
  async getRecommendations(
    @Args('input') input: RecommendationInput,
  ): Promise<ProductRecommendation[]> {
    return this.recommendationService.getRecommendationsForUser(
      input.userId,
      input.limit || 5,
    );
  }

  /**
   * Generate Product Summary
   *
   * Generate an AI-powered description for a product.
   */
  @Mutation(() => ProductSummary, {
    description: 'Generate AI-powered summary for a product.',
  })
  async generateProductSummary(
    @Args('input') input: GenerateSummaryInput,
  ): Promise<ProductSummary> {
    return this.productSummaryService.generateProductSummary(input.productId);
  }

  /**
   * Query with RAG
   *
   * Ask natural language questions about your database.
   *
   * EXAMPLE:
   * "What are our top 5 selling products?"
   * "Which customers haven't purchased in 3 months?"
   */
  @Query(() => RagResponse, {
    description:
      'Ask questions about your database using natural language. AI will query the database and provide answers.',
  })
  async queryWithRag(
    @Args('input') input: RagQueryInput,
  ): Promise<RagResponse> {
    return this.ragService.queryWithRag(input.query);
  }

  /**
   * Export Data
   *
   * Export database data to CSV or Excel format.
   */
  @Query(() => DataExportResult, {
    description: 'Export data to CSV or Excel format with optional filters.',
  })
  async exportData(
    @Args('input') input: DataExportInput,
  ): Promise<DataExportResult> {
    let fileUrl: string;
    let recordCount = 0;

    if (input.format === 'csv') {
      const csvData = await this.dataExportService.exportToCsv(
        input.dataType as any,
        {
          startDate: input.dateFrom,
          endDate: input.dateTo,
          fields: input.fields,
        },
      );
      fileUrl = `data:text/csv;base64,${Buffer.from(csvData).toString('base64')}`;
      recordCount = csvData.split('\n').length - 1;
    } else {
      const buffer = await this.dataExportService.exportToExcel(
        input.dataType as any,
        {
          startDate: input.dateFrom,
          endDate: input.dateTo,
          fields: input.fields,
        },
      );
      fileUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buffer.toString('base64')}`;
    }

    return {
      format: input.format,
      fileName: `${input.dataType}_export_${new Date().toISOString().split('T')[0]}.${input.format === 'csv' ? 'csv' : 'xlsx'}`,
      fileUrl,
      recordCount,
    };
  }

  /**
   * Detect Anomalies
   *
   * Analyze sales patterns and detect unusual activity.
   */
  @Query(() => [AnomalyDetectionResult], {
    description:
      'Detect anomalies in sales patterns, revenue, and order quantities.',
  })
  async detectAnomalies(): Promise<AnomalyDetectionResult[]> {
    return this.anomalyDetectionService.detectAllAnomalies();
  }

  /**
   * Index All Products
   *
   * Prepare all products for semantic search by generating embeddings.
   * Run this after adding new products.
   */
  @Mutation(() => Boolean, {
    description:
      'Index all products for semantic search. Run after adding new products.',
  })
  async indexAllProducts(): Promise<boolean> {
    await this.semanticSearchService.indexAllProducts();
    return true;
  }

  /**
   * Generate Missing Summaries
   *
   * Generate AI summaries for all products without descriptions.
   */
  @Mutation(() => CsvUploadResult, {
    description:
      'Generate AI-powered summaries for all products missing descriptions.',
  })
  async generateMissingSummaries(): Promise<CsvUploadResult> {
    const count = await this.productSummaryService.generateMissingSummaries();

    return {
      totalRows: count,
      successfulRows: count,
      failedRows: 0,
      errors: [],
      message: `Generated ${count} product summaries successfully`,
    };
  }

  /**
   * Get RAG Data Summary
   *
   * Get information about what data is available for RAG queries.
   */
  @Query(() => String, {
    description: 'Get summary of available data for RAG queries.',
  })
  async getRagDataSummary(): Promise<string> {
    return this.ragService.getAvailableDataSummary();
  }
}
