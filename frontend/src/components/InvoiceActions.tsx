"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2, Edit, CheckCircle, XCircle, DollarSign } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteInvoiceAction, updateInvoiceStatusAction, approveInvoiceAction, disapproveInvoiceAction } from "@/app/actions/invoice";
import { toast } from "sonner";
import { LoadingSpinner } from "./LoadingSpinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function InvoiceActions({
    invoiceNumber,
    status,
    isSender, // true if this is a sent invoice (Bill From), false if received (Bill To)
}: {
    invoiceNumber: string;
    status: string;
    isSender?: boolean;
}) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteInvoiceAction(invoiceNumber);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Invoice deleted successfully");
                router.push("/dashboard/invoices");
            }
            setIsDeleteOpen(false);
        });
    };

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveInvoiceAction(invoiceNumber);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Invoice approved successfully");
                router.refresh();
            }
        });
    };

    const handleDecline = () => {
        startTransition(async () => {
            const result = await disapproveInvoiceAction(invoiceNumber);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Invoice declined");
                router.refresh();
            }
        });
    };

    const handleMarkAsPaid = () => {
        startTransition(async () => {
            const result = await updateInvoiceStatusAction(invoiceNumber, "paid");
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Invoice marked as paid");
                router.refresh();
            }
        });
    };

    // Handler for the Select component
    const onStatusSelectChange = (value: string) => {
        if (value === "approved") {
            handleApprove();
        } else if (value === "declined") {
            handleDecline();
        } else if (value === "paid") {
            handleMarkAsPaid();
        }
    };

    return (
        <div className="flex gap-2 print:hidden">
            {isSender ? (
                // Bill From (Sender/Seller): Edit, Delete, Mark as Paid (for APPROVED)
                <>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Edit functionality coming soon")}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>

                    {status.toLowerCase() === "approved" && (
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleMarkAsPaid}
                            disabled={isPending}
                        >
                            {isPending ? <LoadingSpinner className="mr-2" /> : <DollarSign className="w-4 h-4 mr-2" />}
                            Mark as Paid
                        </Button>
                    )}

                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Invoice</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this invoice? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                                    {isPending ? <LoadingSpinner className="mr-2" /> : null}
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            ) : (
                // Bill To (Receiver/Buyer): Approve, Decline (for PENDING or APPROVED)
                <>
                    {(status.toLowerCase() === "pending" || status.toLowerCase() === "approved") && (
                        <>
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleApprove}
                                disabled={isPending}
                            >
                                {isPending ? <LoadingSpinner className="mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                Approve
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                                onClick={handleDecline}
                                disabled={isPending}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline
                            </Button>
                        </>
                    )}
                </>
            )}
            {/* Manual Status Override - Visible to everyone for now based on request */}
            <div className="w-[140px]">
                <Select onValueChange={onStatusSelectChange} disabled={isPending} value={status.toLowerCase()}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approve</SelectItem>
                        <SelectItem value="declined">Decline</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
