"use client";

import { useState } from "react";
import { generateMissingSummaries } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GenerateSummariesButton() {
  const [loading, setLoading] = useState(false);

  const handleGenerateSummaries = async () => {
    setLoading(true);
    try {
      const result = await generateMissingSummaries();

      if (result.success && result.data) {
        toast.success(
          `Generated summaries successfully! ${result.data.successfulRows}/${result.data.totalRows} rows processed.`,
          {
            description: result.data.message,
            duration: 5000,
          }
        );

        if (result.data.failedRows > 0) {
          toast.warning(`${result.data.failedRows} rows failed to process.`, {
            description: result.data.errors?.join(", "),
            duration: 7000,
          });
        }
      } else {
        toast.error(result.error || "Failed to generate summaries");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate summaries");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateSummaries}
      disabled={loading}
      variant="outline"
    >
      {loading ? "Generating..." : "Generate Missing Summaries"}
    </Button>
  );
}
