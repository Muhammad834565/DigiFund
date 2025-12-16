"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ProductsPageClient({
  searchParams,
}: {
  searchParams?: { success?: string; name?: string; indexed?: string };
}) {
  useEffect(() => {
    if (searchParams?.success === "created" && searchParams?.name) {
      const indexedMessage =
        searchParams?.indexed === "true"
          ? "Product has been indexed automatically."
          : "Product created successfully.";

      toast.success(`Product "${searchParams.name}" created successfully!`, {
        description: indexedMessage,
        duration: 5000,
      });
    }
  }, [searchParams]);

  return null;
}
