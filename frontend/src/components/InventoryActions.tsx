"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteInventoryAction, updateInventoryAction } from "@/app/actions/inventory";
import { toast } from "sonner";
import { LoadingSpinner } from "./LoadingSpinner";

export function InventoryActions({
    inventory,
}: {
    inventory: {
        inventory_id: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
        unit_price: number;
    };
}) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        name: inventory.name,
        description: inventory.description,
        price: inventory.price,
        quantity: inventory.quantity,
        unit_price: inventory.unit_price,
    });

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteInventoryAction(inventory.inventory_id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Inventory item deleted successfully");
                router.push("/dashboard/inventory");
            }
            setIsDeleteOpen(false);
        });
    };

    const handleUpdate = () => {
        startTransition(async () => {
            // Price is auto-calculated by backend, so we don't send it.
            const result = await updateInventoryAction(inventory.inventory_id, {
                name: formData.name,
                description: formData.description,
                quantity: parseInt(formData.quantity.toString()),
                unit_price: parseFloat(formData.unit_price.toString()),
            });
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Inventory item updated successfully");
                setIsEditOpen(false);
            }
        });
    };

    return (
        <div className="flex gap-2 print:hidden">
            {/* Edit Button with Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Inventory Item</DialogTitle>
                        <DialogDescription>
                            Make changes to the inventory item details here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Unit Price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.unit_price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, unit_price: parseFloat(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        setFormData({ ...formData, quantity: parseInt(e.target.value) })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={isPending}
                        >
                            {isPending && <LoadingSpinner className="mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Button */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Inventory Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this item? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? <LoadingSpinner className="mr-2" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
