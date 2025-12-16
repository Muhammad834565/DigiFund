import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AiResolver } from './ai.resolver';
import { OpenRouterService } from './services/open-router.service';
import { SemanticSearchService } from './services/semantic-search.service';
import { RecommendationService } from './services/recommendation.service';
import { ProductSummaryService } from './services/product-summary.service';
import { RagService } from './services/rag.service';
import { CsvUploadService } from './services/csv-upload.service';
import { DataExportService } from './services/data-export.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { ProductEmbedding } from '../entities/product-embedding.entity';
import { AnomalyLog } from '../entities/anomaly-log.entity';
import { InventoryMaster } from '../entities/inventory-master.entity';
import { Customer } from '../entities/customer.entity';
import { InvoiceMaster } from '../entities/invoice-master.entity';
import { UserMain } from '../entities/user-main.entity';

/**
 * AIModule
 *
 * Module for all AI-powered features using OpenRouter (replacing Gemini).
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ProductEmbedding,
      AnomalyLog,
      InventoryMaster,
      Customer,
      InvoiceMaster,
      UserMain,
    ]),
  ],
  providers: [
    AiResolver,
    OpenRouterService,
    SemanticSearchService,
    RecommendationService,
    ProductSummaryService,
    RagService,
    CsvUploadService,
    DataExportService,
    AnomalyDetectionService,
  ],
  exports: [
    OpenRouterService,
    SemanticSearchService,
    RecommendationService,
    ProductSummaryService,
    RagService,
    CsvUploadService,
    DataExportService,
    AnomalyDetectionService,
  ],
})
export class AiModule { }
