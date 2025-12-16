"use client";

import { useFormState } from "react-dom";
import { useOptimistic } from "react";
import { createInventory } from "@/app/actions/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InventoryForm({ inventory }: { inventory?: any }) {
  const action = inventory ? createInventory : createInventory; // Update for edit support
  const [state, formAction] = useFormState(action, {} as any);

  const [optimisticInventory, setOptimisticInventory] = useOptimistic(
    inventory || {},
    (_state, newInventory: any) => ({ ..._state, ...newInventory })
  );

  return (
    <form
      action={async (formData) => {
        setOptimisticInventory(Object.fromEntries(formData));
        await formAction(formData);
      }}
      className="space-y-4 border dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 shadow-sm"
    >
      <div>
        <Label>Name</Label>
        <Input
          name="name"
          defaultValue={optimisticInventory.name}
          required
        />
        {/* @ts-ignore */}
        {state.errors?.name && (
          <p className="text-red-500 text-sm">{state.errors.name}</p>
        )}
      </div>

      <div>
        <Label>Description</Label>
        <Input
          name="description"
          defaultValue={optimisticInventory.description}
          required
        />
        {/* @ts-ignore */}
        {state.errors?.description && (
          <p className="text-red-500 text-sm">{state.errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Unit Price</Label>
          <Input
            name="unit_price"
            type="number"
            step="0.01"
            defaultValue={optimisticInventory.unit_price}
            required
          />
          {/* @ts-ignore */}
          {state.errors?.unit_price && (
            <p className="text-red-500 text-sm">{state.errors.unit_price}</p>
          )}
        </div>
        <div>
          <Label>Quantity</Label>
          <Input
            name="quantity"
            type="number"
            defaultValue={optimisticInventory.quantity}
            required
          />
          {/* @ts-ignore */}
          {state.errors?.quantity && (
            <p className="text-red-500 text-sm">{state.errors.quantity}</p>
          )}
        </div>
      </div>

      <div>
        <Label>SKU</Label>
        <Input name="sku" defaultValue={optimisticInventory.sku} required />
        {/* @ts-ignore */}
        {state.errors?.sku && (
          <p className="text-red-500 text-sm">{state.errors.sku}</p>
        )}
      </div>

      <div>
        <Label>Images (comma separated URLs)</Label>
        <Input
          name="images"
          defaultValue={optimisticInventory.images}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
        {state.errors?.images && (
          <p className="text-red-500 text-sm">{state.errors.images}</p>
        )}
      </div>

      <Button type="submit">
        {inventory ? "Update Inventory Item" : "Create Inventory Item"}
      </Button>
    </form>
  );
}
