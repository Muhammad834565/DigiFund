"use server";

import { fetchGraphQL } from "@/lib/graphql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createInventory(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    quantity: parseInt(formData.get("quantity") as string),
    unit_price: parseFloat(formData.get("unit_price") as string),
    sku: formData.get("sku") as string,
    images: (formData.get("images") as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [],
  };

  const mutation = `
    mutation CreateInventory($input: CreateInventoryInput!) {
      createInventory(input: $input) {
        id
        inventory_id
        name
        description
        quantity
        unit_price
        price
        sku
        created_at
      }
    }
  `;

  try {
    const result = await fetchGraphQL(mutation, { input: data });
    if (result.errors) {
      return { errors: result.errors[0].message };
    }

    // Index all products after creation
    const indexMutation = `
      mutation IndexAllProducts {
        indexAllProducts
      }
    `;

    try {
      await fetchGraphQL(indexMutation, {});
    } catch (e) {
      console.error("Indexing failed:", e);
    }

    revalidatePath("/dashboard/inventory");
    redirect("/dashboard/inventory?success=created&description=" + encodeURIComponent(data.name) + "&indexed=true");
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return { errors: error.message || "Failed to create inventory" };
  }
}

export async function updateInventoryAction(
  inventoryId: string,
  data: {
    name: string;
    description: string;
    quantity: number;
    unit_price: number;
  }
) {
  const mutation = `
    mutation UpdateInventory($inventory_id: String!, $input: UpdateInventoryInput!) {
      updateInventory(inventory_id: $inventory_id, input: $input) {
        inventory_id
        name
        description
        price
        quantity
        updated_at
      }
    }
  `;

  try {
    await fetchGraphQL(mutation, {
      inventory_id: inventoryId,
      input: data,
    });
    revalidatePath("/dashboard/inventory");
    revalidatePath(`/dashboard/inventory/${inventoryId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update inventory" };
  }
}

export async function deleteInventoryAction(inventoryId: string) {
  const mutation = `
    mutation DeleteInventory($inventory_id: String!) {
      deleteInventory(inventory_id: $inventory_id) {
        message
      }
    }
  `;

  try {
    await fetchGraphQL(mutation, { inventory_id: inventoryId });
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete inventory" };
  }
}
