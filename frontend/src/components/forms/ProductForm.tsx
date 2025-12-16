"use client";

import { useFormState } from "react-dom";
import { useOptimistic } from "react";
import { createProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductForm({ product }: { product?: any }) {
  const action = product ? createProduct : createProduct; // Note: update action doesn't exist yet
  const [state, formAction] = useFormState(action, {} as any);

  const [optimisticProduct, setOptimisticProduct] = useOptimistic(
    product || {},
    (_state, newProduct: any) => ({ ..._state, ...newProduct })
  );

  return (
    <form
      action={async (formData) => {
        setOptimisticProduct(Object.fromEntries(formData));
        await formAction(formData);
      }}
      className="space-y-4 border dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 shadow-sm"
    >
      <div>
        <Label>Description</Label>
        <Input name="name" defaultValue={optimisticProduct.name} required />
        {state.errors?.name && (
          <p className="text-red-500 text-sm">{state.errors.name}</p>
        )}
      </div>

      <div>
        <Label>Description</Label>
        <Input
          name="description"
          defaultValue={optimisticProduct.description}
        />
        {state.errors?.description && (
          <p className="text-red-500 text-sm">{state.errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price</Label>
          <Input
            name="price"
            type="number"
            step="0.01"
            defaultValue={optimisticProduct.price}
            required
          />
          {state.errors?.price && (
            <p className="text-red-500 text-sm">{state.errors.price}</p>
          )}
        </div>
        <div>
          <Label>Quantity</Label>
          <Input
            name="stock"
            type="number"
            defaultValue={optimisticProduct.stock}
            required
          />
          {state.errors?.stock && (
            <p className="text-red-500 text-sm">{state.errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <Label>SKU</Label>
        <Input name="sku" defaultValue={optimisticProduct.sku} required />
        {state.errors?.sku && (
          <p className="text-red-500 text-sm">{state.errors.sku}</p>
        )}
      </div>

      <div>
        <Label>Images (comma separated URLs)</Label>
        <Input
          name="images"
          defaultValue={optimisticProduct.images}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
        {state.errors?.images && (
          <p className="text-red-500 text-sm">{state.errors.images}</p>
        )}
      </div>

      <Button type="submit">
        {product ? "Update Inventory Item" : "Create Inventory Item"}
      </Button>
    </form>
  );
}
