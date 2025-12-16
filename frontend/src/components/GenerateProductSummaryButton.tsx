"use client";

import { useState } from "react";
import { generateProductSummary } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateProductSummaryButtonProps {
  product: {
    id: string;
    name: string;
    description?: string;
  };
  onSummaryGenerated?: (summary: any) => void;
}

export function GenerateProductSummaryButton({
  product,
  onSummaryGenerated,
}: GenerateProductSummaryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const result = await generateProductSummary(product.id);

      if (result.success && result.data) {
        toast.success("Product summary generated successfully!");

        // Show the generated summary in a toast with details
        toast.info(`Summary Generated for ${product.name}`, {
          description: `Product ID: ${result.data.productId}`,
          duration: 5000,
        });

        // Show response in an alert
        alert(
          `Summary Generated!\n\nProduct: ${result.data.productId}\nSummary: ${result.data.summary}\nKey Features: ${result.data.keyFeatures?.join(", ")}\nTarget Audience: ${result.data.targetAudience}`
        );

        // Log the full response to console for debugging
        console.log("Generated Summary:", result.data);

        if (onSummaryGenerated) {
          onSummaryGenerated(result.data);
        }
      } else {
        toast.error(result.error || "Failed to generate product summary");
        alert(`Error: ${result.error || "Failed to generate product summary"}`);
      }
    } catch (error: unknown) {
      console.error("Error generating summary:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate product summary";
      toast.error(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateSummary}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Summary
        </>
      )}
    </Button>
  );
}
