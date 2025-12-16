import { fetchGraphQL } from "@/lib/graphql";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InventoryItemActions } from "./InventoryItemActions";

export default async function InventoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Use the GetInventoryItem query as requested by the user
  const response = await fetchGraphQL(
    `
    query GetInventoryItem($inventory_id: String!) {
      getInventoryById(inventory_id: $inventory_id) {
        id
        inventory_id
        name
        description
        price
        quantity
        unit_price
        sku
        images
      }
    }
    `,
    { inventory_id: id }
  );

  const inventoryItem = response.getInventoryById;

  if (!inventoryItem) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Inventory Item Not Found</h1>
        <Link href="/dashboard/inventory">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/inventory">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{inventoryItem.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {inventoryItem.description}
                </CardDescription>
                <CardDescription className="font-mono mt-1 text-xs text-muted-foreground">
                  ID: {inventoryItem.inventory_id}
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-sm">
                SKU: {inventoryItem.sku}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Selling Price</span>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(inventoryItem.price)}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Unit Cost</span>
                <div className="text-xl font-semibold">
                  {formatCurrency(inventoryItem.unit_price)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Available Quantity</span>
                <div className={`text-xl font-semibold ${inventoryItem.quantity < 10 ? 'text-amber-600' : ''}`}>
                  {inventoryItem.quantity} units
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">System ID</span>
                <div className="text-sm font-mono text-gray-500 truncate">
                  {inventoryItem.id}
                </div>
              </div>
            </div>

            {/* Images Section */}
            {inventoryItem.images && inventoryItem.images.length > 0 && (
              <div className="pt-4 border-t space-y-2">
                <h3 className="font-medium">Images</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {inventoryItem.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden bg-gray-50 flex-shrink-0">
                      {/* Using standard img tag for simplicity or Next.js Image if preferred, 
                           but for dynamic external urls standard img is safer to avoid domain config issues immediately. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${inventoryItem.description} - Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status/Actions Card - could be expanded */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Stock Status:</span>
              {inventoryItem.quantity > 0 ? (
                <Badge variant="default" className="bg-green-600">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Edit Button placehoder logic */}
            <div className="pt-4 space-y-3">
              <InventoryItemActions productId={inventoryItem.id} />

              <p className="text-xs text-center text-muted-foreground">
                To edit full details, go to the inventory list.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

