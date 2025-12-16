import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * OpenRouterService
 *
 * Replaces GeminiService to interact with OpenRouter API.
 * Provides text generation and embeddings via OpenAI-compatible endpoints.
 */
@Injectable()
export class OpenRouterService {
    private readonly logger = new Logger(OpenRouterService.name);
    private readonly apiKey: string;
    private readonly baseUrl = 'https://openrouter.ai/api/v1';
    private readonly siteUrl = 'http://localhost:3000'; // Optional: for OpenRouter rankings
    private readonly siteName = 'Ecomerce API'; // Optional: for OpenRouter rankings

    // Models
    private readonly textModel = 'mistralai/mistral-7b-instruct'; // Free tier model on OpenRouter
    private readonly embeddingModel = 'openai/text-embedding-3-small'; // Embedding model (requires OpenAI credits via OpenRouter)

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('OPENROUTE_API_KEY') || '';
        console.log("OPENROUTE_API_KEY", this.apiKey);
        if (!this.apiKey) {
            this.logger.warn(
                'OPENROUTE_API_KEY is not found in environment variables. ' +
                'AI features will fail until OPENROUTE_API_KEY is set in .env file.'
            );
        } else {
            this.logger.log('Initializing OpenRouter Service');
        }
    }

    /**
     * Generate Text Response
     */
    async generateText(prompt: string): Promise<string> {
        try {
            this.logger.log(`Generating text via OpenRouter: ${prompt.substring(0, 50)}...`);

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.siteUrl,
                    'X-Title': this.siteName,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.textModel,
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const text = data.choices[0]?.message?.content || '';

            return text;
        } catch (error) {
            this.logger.error('Error generating text:', error);
            throw error;
        }
    }

    /**
     * Generate Embeddings
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            this.logger.log(`Generating embedding via OpenRouter: ${text.substring(0, 50)}...`);

            if (!this.apiKey) {
                this.logger.error('API Key is missing. Cannot generate embedding.');
                throw new Error('OPENROUTE_API_KEY is not set.');
            }


            // Note: OpenRouter might route this to OpenAI or another provider
            const response = await fetch(`${this.baseUrl}/embeddings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.siteUrl,
                    'X-Title': this.siteName,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.embeddingModel,
                    input: text,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const embedding = data.data?.[0]?.embedding;

            if (!embedding) {
                throw new Error('No embedding returned from OpenRouter');
            }

            return embedding;
        } catch (error) {
            this.logger.error('Error generating embedding:', error);
            throw error;
        }
    }

    /**
     * Generate Structured Response (JSON)
     */
    async generateStructuredResponse<T>(prompt: string, schema: string): Promise<T> {
        try {
            const fullPrompt = `${prompt}\n\nRespond ONLY with valid JSON matching this schema:\n${schema}`;

            const text = await this.generateText(fullPrompt);

            // Extract JSON
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                // Try parsing the whole text if no blocks found
                return JSON.parse(text);
            }

            const jsonText = jsonMatch[1] || jsonMatch[0];
            return JSON.parse(jsonText);
        } catch (error) {
            this.logger.error('Error generating structured response:', error);
            throw new Error(`Failed to parse structured response: ${error.message}`);
        }
    }

    /**
     * Calculate Cosine Similarity
     */
    cosineSimilarity(vec1: number[], vec2: number[]): number {
        if (vec1.length !== vec2.length) {
            // If lengths differ (different models), we can't compare directly.
            // Return 0 or log warning.
            // this.logger.warn(`Vector length mismatch: ${vec1.length} vs ${vec2.length}`);
            return 0;
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);

        if (denominator === 0) {
            return 0;
        }

        return dotProduct / denominator;
    }

    /**
     * Health Check
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.generateText('Say OK');
            return response.length > 0;
        } catch (error) {
            return false;
        }
    }
}
