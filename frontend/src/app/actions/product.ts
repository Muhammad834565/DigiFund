"use server";

import { fetchGraphQL } from "@/lib/graphql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01), // Coerce converts string input to number
  stock: z.coerce.number().int().min(0),
  sku: z.string().min(1),
  images: z.string().optional(),
});

export async function createProduct(prevState: any, formData: FormData) {
  const validated = ProductSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // Map form data to CreateInventory input
  const inventoryInput = {
    description: validated.data.name,
    price: validated.data.price,
    quantity: validated.data.stock,
    unit_price: validated.data.price,
    sku: validated.data.sku,
    images: validated.data.images ? validated.data.images.split(',').map((url: string) => url.trim()) : [],
  };

  const mutation = `
    mutation CreateInventory($input: CreateInventoryInput!) {
      createInventory(input: $input) {
        id
        inventory_id
        description
        price
        quantity
        sku
        images
        created_at
      }
    }
  `;

  const indexMutation = `
    mutation IndexAllProducts {
      indexAllProducts
    }
  `;

  try {
    const result = await fetchGraphQL(mutation, { input: inventoryInput });
    // Automatically index all products after creating a new product
    await fetchGraphQL(indexMutation);

    revalidatePath("/dashboard/inventory");
    redirect(
      `/dashboard/inventory?success=created&name=${encodeURIComponent(result.createInventory.description)}&indexed=true`
    );
  } catch (error) {
    return { message: "Failed to create product" };
  }
}

export async function deleteProduct(id: string) {
  const mutation = `mutation DeleteProduct($id: String!) { deleteProduct(id: $id) }`;

  try {
    await fetchGraphQL(mutation, { id });
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    // Check if it's a foreign key constraint error
    if (
      error.message?.includes("foreign key") ||
      error.message?.includes("constraint") ||
      error.message?.includes("referenced") ||
      error.message?.includes("invoices")
    ) {
      return {
        error:
          "Cannot delete this product because it is used in one or more invoices. Please delete the invoices first.",
      };
    }
    return { error: error.message || "Failed to delete product" };
  }
}

export async function generateMissingSummaries() {
  const mutation = `
    mutation GenerateMissingSummaries {
      generateMissingSummaries {
        totalRows
        successfulRows
        failedRows
        errors
        message
      }
    }
  `;

  try {
    const result = await fetchGraphQL(mutation);
    revalidatePath("/dashboard/inventory");
    return { success: true, data: result.generateMissingSummaries };
  } catch (error: any) {
    return { error: error.message || "Failed to generate missing summaries" };
  }
}

export async function generateProductSummary(productId: string) {
  const mutation = `
    mutation GenerateProductSummary($productId: String!) {
      generateProductSummary(input: { productId: $productId }) {
        productId
        summary
        keyFeatures
        targetAudience
      }
    }
  `;

  try {
    const result = await fetchGraphQL(mutation, { productId });
    return { success: true, data: result.generateProductSummary };
  } catch (error: any) {
    return { error: error.message || "Failed to generate product summary" };
  }
}
