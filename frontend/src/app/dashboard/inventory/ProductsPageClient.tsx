"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function InventoryPageClient({
  searchParams,
}: {
  searchParams?: { success?: string; description?: string; indexed?: string };
}) {
  useEffect(() => {
    if (searchParams?.success === "created" && searchParams?.description) {
      const indexedMessage =
        searchParams?.indexed === "true"
          ? "Inventory item has been indexed automatically."
          : "Inventory item created successfully.";

      toast.success(
        `Inventory "${searchParams.description}" created successfully!`,
        {
          description: indexedMessage,
          duration: 5000,
        }
      );
    }
  }, [searchParams]);

  return null;
}
