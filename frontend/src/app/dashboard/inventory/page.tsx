"use client";

import { useGetMyInventoryQuery, useDeleteInventoryMutation, useCreateInventoryMutation, useUpdateInventoryMutation, GetMyInventoryDocument, useIndexAllProductsMutation, useGenerateMissingSummariesMutation } from "@/graphql/generated/graphql";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState } from "react";
import { Plus, Trash2, Edit, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function InventoryPage() {
  const { data, loading, error } = useGetMyInventoryQuery();
  const [createInventory] = useCreateInventoryMutation();
  const [updateInventory] = useUpdateInventoryMutation();
  const [deleteInventory] = useDeleteInventoryMutation();
  const [indexAllProducts] = useIndexAllProductsMutation();
  const [generateMissingSummaries, { loading: generatingSummaries }] = useGenerateMissingSummariesMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    unit_price: "",
    sku: "",
    images: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const images = formData.images.length ? formData.images : ["https://placehold.co/100"];
      await createInventory({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            quantity: parseInt(formData.quantity.toString()),
            unit_price: parseFloat(formData.unit_price.toString()),
            sku: formData.sku,
            images: images
          }
        },
        refetchQueries: [{ query: GetMyInventoryDocument }]
      });
      toast.success("Item created successfully");

      // Index products
      try {
        await indexAllProducts();
      } catch (e) {
        console.error("Indexing failed", e);
      }

      setIsCreateOpen(false);
      setFormData({ name: "", description: "", price: "", quantity: "", unit_price: "", sku: "", images: [] });
    } catch (err: any) {
      toast.error("Failed to create item: " + err.message);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateInventory({
        variables: {
          inventory_id: editingItem.inventory_id,
          input: {
            name: formData.name,
            description: formData.description,
            quantity: parseInt(formData.quantity.toString()),
            unit_price: parseFloat(formData.unit_price.toString()),
          }
        },
        refetchQueries: [{ query: GetMyInventoryDocument }]
      });
      toast.success("Item updated successfully");
      setEditingItem(null);
      setFormData({ name: "", description: "", price: "", quantity: "", unit_price: "", sku: "", images: [] });
    } catch (err: any) {
      toast.error("Failed to update item: " + err.message);
    }
  };

  const confirmDelete = (inventoryId: string) => {
    setItemToDelete(inventoryId);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteInventory({
        variables: { inventory_id: itemToDelete },
        refetchQueries: [{ query: GetMyInventoryDocument }]
      });
      toast.success("Item deleted");
      setIsDeleteOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      unit_price: item.unit_price.toString(),
      sku: item.sku,
      images: item.images || []
    });
  };

  const items = data?.getInventory || [];

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const res = await generateMissingSummaries();
                if (res.data?.generateMissingSummaries) {
                  toast.success(res.data.generateMissingSummaries.message);
                }
              } catch (e: any) {
                toast.error("Generation failed: " + e.message);
              }
            }}
            disabled={generatingSummaries}
          >
            {generatingSummaries ? <LoadingSpinner size="sm" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Summaries
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input name="description" value={formData.description} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input name="sku" value={formData.sku} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Unit Price</Label>
                  <Input type="number" step="0.01" name="unit_price" value={formData.unit_price} onChange={handleInputChange} required />
                </div>
                <Button type="submit" className="w-full">Create Item</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center h-24 text-muted-foreground">No inventory items found.</TableCell></TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">
                      <Link href={`/dashboard/inventory/${item.inventory_id}`} className="hover:underline text-blue-600">
                        {item.sku}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price?.toFixed(2)}</TableCell>
                    <TableCell>${item.unit_price?.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog open={!!editingItem && editingItem.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Inventory</DialogTitle></DialogHeader>
                          <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input name="description" value={formData.description} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Quantity</Label>
                              <Input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Unit Price</Label>
                              <Input type="number" step="0.01" name="unit_price" value={formData.unit_price} onChange={handleInputChange} required />
                            </div>
                            <Button type="submit" className="w-full">Update Item</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => confirmDelete(item.inventory_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inventory Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
