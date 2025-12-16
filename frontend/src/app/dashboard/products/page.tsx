"use client";

import { useGetAllProductsQuery, useGetMyInventoryQuery } from "@/graphql/generated/graphql";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { GenerateSummariesButton } from "@/components/GenerateSummariesButton";
import { ProductsPageClient } from "./ProductsPageClient";
import ExportButtons from "@/components/ExportButtons";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { success?: string; name?: string; indexed?: string };
}) {
  const { data, loading, error } = useGetAllProductsQuery();
  const { data: inventoryData, loading: inventoryLoading, error: inventoryError } = useGetMyInventoryQuery();

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  const products = data?.products || [];
  const inventory = inventoryData?.getInventory || [];

  return (
    <div className="space-y-4">
      <ProductsPageClient searchParams={searchParams} />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Products</h1>
        <div className="flex gap-2">
          <ExportButtons dataType="products" />
          <GenerateSummariesButton />
          <Link href="/dashboard/products/create">
            <Button>Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/products/view/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {p.name}
                  </Link>
                </TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/dashboard/products/${p.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Inventory Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold dark:text-white">Inventory</h2>
        {inventoryLoading ? (
          <LoadingSpinner />
        ) : inventoryError ? (
          <p>Error loading inventory: {inventoryError.message}</p>
        ) : (
          <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unit_price}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      {item.images && item.images.length > 0 ? (
                        <div className="flex gap-1">
                          {item.images.slice(0, 3).map((image: string, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ))}
                          {item.images.length > 3 && (
                            <span className="text-sm text-gray-500">+{item.images.length - 3} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No images</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
