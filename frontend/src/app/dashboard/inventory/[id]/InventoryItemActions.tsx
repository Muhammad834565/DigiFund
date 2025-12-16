"use client";

import { useGenerateProductSummaryMutation } from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InventoryItemActionsProps {
    productId: string;
}

export function InventoryItemActions({ productId }: InventoryItemActionsProps) {
    const [generateSummary, { loading }] = useGenerateProductSummaryMutation();
    const router = useRouter();

    const handleGenerateSummary = async () => {
        try {
            const res = await generateSummary({
                variables: {
                    input: {
                        productId: productId,
                    },
                },
            });

            if (res.data?.generateProductSummary) {
                toast.success("Summary generated successfully!");
                // Refresh the page to show new data if it was updated in the backend
                router.refresh();
            }
        } catch (e: any) {
            toast.error("Failed to generate summary: " + e.message);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate AI Summary
        </Button>
    );
}
