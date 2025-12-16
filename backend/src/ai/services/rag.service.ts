import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMaster } from '../../entities/inventory-master.entity';
import { Customer } from '../../entities/customer.entity';
import { InvoiceMaster } from '../../entities/invoice-master.entity';
import { UserMain } from '../../entities/user-main.entity';
import { OpenRouterService } from './open-router.service';
import { RagResponse } from '../dto/ai-types';

/**
 * RAGService (Retrieval Augmented Generation)
 *
 * This service implements RAG specifically for your database.
 */
@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    @InjectRepository(InventoryMaster)
    private inventoryRepository: Repository<InventoryMaster>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(InvoiceMaster)
    private invoiceRepository: Repository<InvoiceMaster>,
    @InjectRepository(UserMain)
    private userRepository: Repository<UserMain>,
    private openRouterService: OpenRouterService,
  ) { }

  /**
   * Query with RAG
   *
   * Main method that implements RAG pattern.
   *
   * @param query - Natural language question
   * @returns Answer with sources
   */
  async queryWithRag(query: string): Promise<RagResponse> {
    try {
      this.logger.log(`Processing RAG query: ${query}`);

      // Step 1: Determine which database tables are relevant
      const intent = await this.analyzeQueryIntent(query);
      this.logger.log(`Query intent: ${intent.dataNeeded.join(', ')}`);

      // Step 2: Retrieve relevant data from database
      const context = await this.retrieveContext(intent.dataNeeded);
      this.logger.log(
        `Retrieved ${context.sources.length} data sources from database`,
      );

      // Step 3: Generate answer using ONLY database data
      const answer = await this.generateAnswer(query, context.data);

      const result: RagResponse = {
        answer,
        sources: context.sources,
        confidenceScore: this.calculateConfidence(context.data),
        followUpSuggestions: [],
      };

      this.logger.log('RAG query processed successfully');
      return result;
    } catch (error) {
      this.logger.error('Failed to process RAG query:', error);
      throw error;
    }
  }

  /**
   * Analyze Query Intent
   *
   * Determines what database tables/data are needed for the query.
   *
   * EXAMPLE:
   * "Show top customers" → needs customers, invoices
   * "What products are low stock?" → needs products
   *
   * @param query - User question
   * @returns Intent analysis
   */
  /**
   * Analyze Query Intent
   *
   * Determines what database tables/data are needed for the query.
   * Uses rule-based fallback if AI is unavailable.
   */
  private async analyzeQueryIntent(
    query: string,
  ): Promise<{ dataNeeded: string[] }> {
    try {
      // Try AI first
      // const prompt = `...`; 
      // const response = await this.openRouterService.generateText(prompt);
      // Use fallback directly to save costs/fix errors
      throw new Error('Using fallback intent analysis');
    } catch (error) {
      this.logger.warn('AI intent analysis failed, using rule-based fallback');
      const dataNeeded: string[] = [];
      const q = query.toLowerCase();

      // Simple keyword matching for tables
      if (q.includes('product') || q.includes('inventory') || q.includes('stock') || q.includes('price') || q.includes('item')) {
        dataNeeded.push('products');
      }

      if (q.includes('customer') || q.includes('client') || q.includes('who bought')) {
        dataNeeded.push('customers');
      }

      if (q.includes('invoice') || q.includes('sale') || q.includes('order') || q.includes('revenue') || q.includes('sold')) {
        dataNeeded.push('invoices');
      }

      // Matches "user", "staff", "admin", "role", or specific user table request
      if (q.includes('user') || q.includes('admin') || q.includes('staff') || q.includes('role') || q.includes('account')) {
        dataNeeded.push('users');
      }

      return { dataNeeded };
    }
  }

  /**
   * Retrieve Context from Database
   *
   * Fetches actual data from specified tables.
   */
  private async retrieveContext(
    dataNeeded: string[],
  ): Promise<{ data: string; sources: string[] }> {
    const dataParts: string[] = [];
    const sources: string[] = [];

    // Fetch products if needed
    if (dataNeeded.includes('products')) {
      const inventory = await this.inventoryRepository.find({
        take: 20,
        order: { unit_price: 'DESC' },
      });

      if (inventory.length > 0) {
        dataParts.push(
          'PRODUCTS/INVENTORY:\n' +
          inventory
            .map(
              (p) =>
                `- ${p.description || p.sku || p.name}: $${p.unit_price}, Quantity: ${p.quantity}`,
            )
            .join('\n'),
        );
        sources.push(`Inventory table (${inventory.length} records)`);
      }
    }

    // Fetch customers if needed
    if (dataNeeded.includes('customers')) {
      const customers = await this.customerRepository.find({
        take: 20,
        order: { createdAt: 'DESC' },
      });

      if (customers.length > 0) {
        dataParts.push(
          'CUSTOMERS:\n' +
          customers
            .map((c) => `- ${c.name} (${c.email}, Phone: ${c.phone})`)
            .join('\n'),
        );
        sources.push(`Customers table (${customers.length} records)`);
      }
    }

    // Fetch invoices if needed
    if (dataNeeded.includes('invoices')) {
      const invoices = await this.invoiceRepository.find({
        take: 20,
        order: { created_at: 'DESC' },
      });

      if (invoices.length > 0) {
        dataParts.push(
          'INVOICES:\n' +
          invoices
            .map(
              (i) =>
                `- Invoice ${i.invoice_number}, Total: $${i.total_amount}, Date: ${i.created_at?.toISOString().split('T')[0] || 'N/A'}, Status: ${i.status}`,
            )
            .join('\n'),
        );
        sources.push(`Invoices table (${invoices.length} records)`);
      }
    }

    // Fetch users if needed (Mapped to UserMain entity)
    if (dataNeeded.includes('users')) {
      const users = await this.userRepository.find({
        take: 20,
      });

      if (users.length > 0) {
        dataParts.push(
          'USERS (from user_main):\n' +
          users
            .map((u) => `- ${u.contact_person} (${u.email}, Role: ${u.role}, Status: ${u.status})`)
            .join('\n'),
        );
        sources.push(`Users table (${users.length} records)`);
      }
    }

    return {
      data: dataParts.join('\n\n'),
      sources,
    };
  }

  /**
   * Generate Answer
   *
   * Uses Gemini to create natural language answer from database data.
   * Fallbacks to direct data display if AI is unavailable.
   */
  private async generateAnswer(
    query: string,
    context: string,
  ): Promise<string> {
    try {
      // Try AI generation first
      const prompt = `You are a database query assistant. Answer the user's question using ONLY the provided database data.

STRICT RULES:
1. Use ONLY the data below - no external knowledge
2. If data is insufficient, say "I don't have enough data to answer that"
3. Be specific with numbers and details from the data
4. Format your answer clearly

DATABASE DATA:
${context}

USER QUESTION: ${query}

ANSWER (using only the database data above):`;

      return await this.openRouterService.generateText(prompt);
    } catch (error) {
      this.logger.warn('AI answer generation failed, using fallback template');

      if (!context || context.trim().length === 0) {
        return "I couldn't find any relevant data in the database to answer your question.";
      }

      return `Here is the data I found based on your query:\n\n${context}\n\n(AI generation unavailable: ${error.message})`;
    }
  }

  /**
   * Calculate Confidence
   *
   * Estimates how confident we are in the answer based on data availability.
   *
   * More data = higher confidence
   *
   * @param context - Retrieved database data
   * @returns Confidence score 0-100
   */
  private calculateConfidence(context: string): number {
    if (!context || context.trim().length === 0) {
      return 0; // No data
    }

    // Simple heuristic: more data = higher confidence
    const dataLines = context.split('\n').filter((l) => l.trim().length > 0);

    if (dataLines.length === 0) return 20;
    if (dataLines.length < 5) return 40;
    if (dataLines.length < 20) return 70;
    return 90; // Lots of data available
  }

  /**
   * Get Available Data Summary
   *
   * Returns a summary of what data is available in the database.
   * Useful for users to understand what questions they can ask.
   *
   * @returns Summary of database contents
   */
  async getAvailableDataSummary(): Promise<string> {
    const productCount = await this.inventoryRepository.count();
    const customerCount = await this.customerRepository.count();
    const invoiceCount = await this.invoiceRepository.count();
    const userCount = await this.userRepository.count();

    return `Available database information:
              - Products / Inventory: ${productCount} items in stock
              - Customers: ${customerCount} customer records
            - Invoices: ${invoiceCount} sales transactions
            - Users: ${userCount} system users

You can ask questions about:
• Product inventory and pricing
• Customer information
• Sales history and revenue
• User accounts

Example questions:
• "What are the top 5 most expensive products?"
• "Which customers have made the most purchases?"
• "What was our total revenue last month?"
• "Which products are low on stock?"`;
  }
}
