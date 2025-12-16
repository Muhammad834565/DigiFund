"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { approveInvoiceAction, disapproveInvoiceAction } from "@/app/actions/invoice";
import { Loader2 } from "lucide-react";

interface InvoiceActionButtonsProps {
    invoiceId: string; // This is actually invoice_number based on the action signature
}

export function InvoiceActionButtons({ invoiceId }: InvoiceActionButtonsProps) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveInvoiceAction(invoiceId);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Invoice approved successfully");
            }
        });
    };

    const handleDecline = () => {
        startTransition(async () => {
            const result = await disapproveInvoiceAction(invoiceId);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Invoice declined");
            }
        });
    };

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700 h-8"
                onClick={handleApprove}
                disabled={isPending}
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                Approve
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 h-8"
                onClick={handleDecline}
                disabled={isPending}
            >
                <XCircle className="h-4 w-4 mr-1" />
                Decline
            </Button>
        </div>
    );
}
