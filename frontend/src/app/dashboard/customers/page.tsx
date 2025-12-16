"use client";

import { useGetAllCustomersQuery, useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation, GetAllCustomersDocument } from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState } from "react";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

export default function CustomersPage() {
  const { data, loading, error } = useGetAllCustomersQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer({
        variables: { input: formData },
        refetchQueries: [{ query: GetAllCustomersDocument }]
      });
      toast.success("Customer created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (err: any) {
      toast.error("Failed to create customer: " + err.message);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateCustomer({
        variables: {
          id: editingItem.id,
          input: formData
        },
        refetchQueries: [{ query: GetAllCustomersDocument }]
      });
      toast.success("Customer updated successfully");
      setEditingItem(null);
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (err: any) {
      toast.error("Failed to update customer: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer({
        variables: { id },
        refetchQueries: [{ query: GetAllCustomersDocument }]
      });
      toast.success("Customer deleted");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address
    });
  };

  const customers = data?.customers || [];

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <Button type="submit" className="w-full">Create Customer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!viewingItem} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Full information for {viewingItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">ID</Label>
                <p className="font-mono text-xs mt-1">{viewingItem?.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Created At</Label>
                <p className="mt-1">{viewingItem?.createdAt ? new Date(viewingItem.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium mt-1">{viewingItem?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="mt-1">{viewingItem?.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="mt-1">{viewingItem?.phone}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Address</Label>
                <p className="mt-1">{viewingItem?.address}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No customers found.</TableCell></TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer?.id}>
                    <TableCell className="font-medium">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-blue-600 hover:underline"
                        onClick={() => setViewingItem(customer)}
                      >
                        {customer?.name}
                      </Button>
                    </TableCell>
                    <TableCell>{customer?.email}</TableCell>
                    <TableCell>{customer?.phone}</TableCell>
                    <TableCell>{customer?.address}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog open={!!editingItem && editingItem.id === customer?.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(customer)}><Edit className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
                          <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input name="phone" value={formData.phone} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                              <Label>Address</Label>
                              <Input name="address" value={formData.address} onChange={handleInputChange} required />
                            </div>
                            <Button type="submit" className="w-full">Update Customer</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => customer?.id && handleDelete(customer.id)}>
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
    </div>
  );
}
