"use client";

import { useState } from "react";
import { generateProductSummary } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageCircle, Sparkles, Users, Target } from "lucide-react";

interface ProductSummaryData {
  productId: string;
  summary: string;
  keyFeatures: string[];
  targetAudience: string;
}

interface ProductSummaryChatProps {
  product: {
    id: string;
    name: string;
    description?: string;
  };
}

export function ProductSummaryChat({ product }: ProductSummaryChatProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ProductSummaryData | null>(null);

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const result = await generateProductSummary(product.id);

      if (result.success && result.data) {
        setSummary(result.data);
        toast.success("Product summary generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate product summary");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate product summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Product Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Generate an AI-powered summary for <strong>{product.name}</strong>
        </div>

        <Button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Summary
            </>
          )}
        </Button>

        {summary && (
          <div className="space-y-4 mt-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {summary.summary}
              </p>
            </div>

            {summary.keyFeatures && summary.keyFeatures.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Key Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {summary.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.targetAudience && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Target Audience
                </h4>
                <p className="text-sm text-muted-foreground">
                  {summary.targetAudience}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
