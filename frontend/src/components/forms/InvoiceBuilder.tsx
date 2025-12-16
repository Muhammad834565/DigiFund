"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, AlertTriangle } from "lucide-react";
import { createInvoiceAction } from "@/app/actions/invoice";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Define Zod Schema for the Form
const InvoiceSchema = z.object({
  recipientType: z.enum(["customer", "supplier"]),
  recipientId: z.string().min(1, "Recipient is required"),
  items: z
    .array(
      z.object({
        inventoryId: z.string().min(1, "Product is required"),
        qty: z.number().min(1, "Quantity must be at least 1"),
        discountPercentage: z.number().min(0).max(100).optional(),
      })
    )
    .min(1, "At least one item is required"),
});

type InvoiceFormValues = z.infer<typeof InvoiceSchema>;

export function InvoiceBuilder({
  customers,
  suppliers,
  inventory,
}: {
  customers: any[];
  suppliers: any[];
  inventory: any[];
}) {
  const [isPending, startTransition] = useTransition();
  const [recipientType, setRecipientType] = useState<"customer" | "supplier">("customer");

  // Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      recipientType: "customer",
      recipientId: "",
      items: [{ inventoryId: "", qty: 1, discountPercentage: 0 }],
    },
  });

  // Manage Dynamic Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // Get inventory item details
  const getInventoryItem = (inventoryId: string) => {
    return inventory.find((item) => item.inventory_id === inventoryId);
  };

  // Check if quantity exceeds available stock
  const checkStockAvailability = (inventoryId: string, qty: number) => {
    const item = getInventoryItem(inventoryId);
    return item && qty > item.quantity;
  };

  // Handle Submission
  const onSubmit = (data: InvoiceFormValues) => {
    startTransition(async () => {
      let recipientDetails;

      if (data.recipientType === "customer") {
        const customer = customers.find(c => c.id === data.recipientId);
        if (customer) {
          recipientDetails = {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address
          };
        }
      }

      const itemsWithRate = data.items.map(item => {
        const inventoryItem = getInventoryItem(item.inventoryId);
        return {
          ...item,
          rate: inventoryItem?.unit_price || inventoryItem?.price || 0
        };
      });

      const result = await createInvoiceAction({
        ...data,
        items: itemsWithRate,
        recipientDetails
      });

      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Recipient Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Invoice To</Label>
        <Tabs
          value={recipientType}
          onValueChange={(value) => {
            setRecipientType(value as "customer" | "supplier");
            setValue("recipientType", value as "customer" | "supplier");
            setValue("recipientId", ""); // Reset recipient when switching
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="supplier">Supplier</TabsTrigger>
          </TabsList>

          {/* Customer Selection */}
          <TabsContent value="customer" className="space-y-2">
            <Label className="text-sm">Select Customer</Label>
            <Select onValueChange={(val: string) => setValue("recipientId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>

          {/* Supplier Selection */}
          <TabsContent value="supplier" className="space-y-2">
            <Label className="text-sm">Select Supplier</Label>
            <Select onValueChange={(val: string) => setValue("recipientId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.supplier_public_id}>
                    {s.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
        </Tabs>
        {errors.recipientId && (
          <p className="text-red-500 text-sm">{errors.recipientId.message}</p>
        )}
      </div>

      {/* Dynamic Items List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold dark:text-white">Order Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ inventoryId: "", qty: 1, discountPercentage: 0 })}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const selectedItem = getInventoryItem(watchItems[index]?.inventoryId || "");
            const isLowStock = checkStockAvailability(
              watchItems[index]?.inventoryId || "",
              watchItems[index]?.qty || 0
            );

            return (
              <div
                key={field.id}
                className="border dark:border-gray-700 p-4 rounded-md bg-slate-50 dark:bg-gray-800 space-y-3"
              >
                <div className="flex gap-4 items-end">
                  {/* Inventory Select */}
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-medium">Product</label>
                    <select
                      {...register(`items.${index}.inventoryId`)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select Product</option>
                      {inventory.map((item) => (
                        <option key={item.id} value={item.inventory_id}>
                          {item.description} {item.sku ? `(SKU: ${item.sku})` : ""} - $
                          {item.unit_price || item.price} (Stock: {item.quantity})
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.inventoryId && (
                      <p className="text-red-500 text-xs">
                        {errors.items[index]?.inventoryId?.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity Input */}
                  <div className="w-24 space-y-2">
                    <label className="text-xs font-medium">Qty</label>
                    <Input
                      type="number"
                      {...register(`items.${index}.qty`, { valueAsNumber: true })}
                    />
                  </div>

                  {/* Discount Input */}
                  <div className="w-24 space-y-2">
                    <label className="text-xs font-medium">Discount %</label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      {...register(`items.${index}.discountPercentage`, { valueAsNumber: true })}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                {/* Stock Warning */}
                {isLowStock && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-2 rounded text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      Warning: Requested quantity exceeds available stock (
                      {selectedItem?.quantity} available)
                    </span>
                  </div>
                )}

                {/* Item Details and Line Total */}
                {selectedItem && (
                  <div className="flex justify-between items-start bg-background p-2 rounded border dark:border-gray-700">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex gap-2">
                        <span>Unit Price:</span>
                        <span className="font-medium">
                          ${selectedItem.unit_price || selectedItem.price}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span>Available:</span>
                        <span className="font-medium">{selectedItem.quantity} units</span>
                      </div>
                      {selectedItem.sku && (
                        <div className="flex gap-2">
                          <span>SKU:</span>
                          <span className="font-mono">{selectedItem.sku}</span>
                        </div>
                      )}
                    </div>

                    {/* Calculated Line Total */}
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Line Total</div>
                      <div className="text-lg font-bold text-primary">
                        ${((
                          (selectedItem.unit_price || selectedItem.price) *
                          (watchItems[index]?.qty || 0) *
                          (1 - (watchItems[index]?.discountPercentage || 0) / 100)
                        ).toFixed(2))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {errors.items && (
          <p className="text-red-500 text-sm">{errors.items.message}</p>
        )}

        {/* Grand Total Display */}
        {fields.length > 0 && (
          <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <div className="text-right space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Grand Total</div>
              <div className="text-3xl font-bold">
                ${watchItems.reduce((acc, item) => {
                  const inventoryItem = getInventoryItem(item.inventoryId);
                  if (!inventoryItem) return acc;

                  const price = inventoryItem.unit_price || inventoryItem.price || 0;
                  const qty = item.qty || 0;
                  const discount = item.discountPercentage || 0;

                  return acc + (price * qty * (1 - discount / 100));
                }, 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <LoadingSpinner className="mr-2" />
            Creating Invoice...
          </>
        ) : (
          "Create Invoice"
        )}
      </Button>
    </form>
  );
}
