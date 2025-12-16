"use client";

import { useGetMyInvoicesQuery, useInvoiceReceivedSubscription, GetMyInvoicesDocument, useGetMyProfileQuery } from "@/graphql/generated/graphql";
import { updateInvoiceStatusAction } from "@/app/actions/invoice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, CheckCircle } from "lucide-react"; // Import necessary icons, CheckCircle for approve button
import { DeleteInvoiceButton } from "@/components/DeleteInvoiceButton";
import { InvoiceActionButtons } from "@/components/InvoiceActionButtons";
import ExportButtons from "@/components/ExportButtons";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function InvoicesPage() {
  const { data: profileData } = useGetMyProfileQuery();
  const { data, loading, error, refetch } = useGetMyInvoicesQuery({
    errorPolicy: "all",
    fetchPolicy: "network-only",
  });

  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleMarkAsPaid = async (invoiceNumber: string) => {
    try {
      const result = await updateInvoiceStatusAction(invoiceNumber, "paid");
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Invoice marked as paid");
        refetch(); // Refetch the invoices to update the UI
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update invoice");
    }
  };

  const invoices = data?.getInvoices || [];
  const myPublicId = profileData?.me?.public_id;

  const filterByStatus = (inv: any) => {
    if (statusFilter === "ALL") return true;
    return inv.status?.toUpperCase() === statusFilter;
  };

  const sentInvoices = invoices.filter(inv => inv.bill_from_public_id === myPublicId && filterByStatus(inv));
  const receivedInvoices = invoices.filter(inv => inv.bill_to_public_id === myPublicId && filterByStatus(inv));

  // Subscription hook remains the same
  useInvoiceReceivedSubscription({
    onData: ({ client, data: subscriptionData }) => {
      const newInvoice = subscriptionData?.data?.invoiceReceived;
      if (!newInvoice) return;
      client.cache.updateQuery({ query: GetMyInvoicesDocument }, (existingData: any) => {
        if (existingData?.getInvoices && newInvoice) {
          return {
            getInvoices: [newInvoice, ...existingData.getInvoices],
          };
        }
        return existingData;
      });
      toast.info(`New invoice received: ${newInvoice.invoice_number}`);
    },
  });

  const InvoiceTable = ({ invoiceList, isReceived }: { invoiceList: any[], isReceived: boolean }) => (
    <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Bill From</TableHead>
            <TableHead>Bill To</TableHead>
            <TableHead>Total ($)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </TableCell>
            </TableRow>
          ) : invoiceList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            invoiceList.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono font-medium">
                  <Link href={`/dashboard/invoices/${inv.invoice_number}`} className="text-blue-600 hover:underline">
                    {inv.invoice_number}
                  </Link>
                </TableCell>
                <TableCell>{inv.bill_from_name || inv.bill_from_public_id}</TableCell>
                <TableCell>{inv.bill_to_name || inv.bill_to_public_id}</TableCell>
                <TableCell className="font-bold">${inv.total_amount?.toFixed(2)}</TableCell>
                <TableCell>
                  {/* Conditional Status Display */}
                  {inv.status === "PENDING" ? (
                    !isReceived ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Waiting for Approval
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Action Required</Badge>
                    )
                  ) : (
                    <Badge variant={inv.status?.toLowerCase() === "paid" ? "default" : inv.status?.toLowerCase() === "approved" ? "outline" : "outline"} className={inv.status?.toLowerCase() === "approved" ? "bg-green-50 text-green-700 border-green-200" : ""}>
                      {inv.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(inv.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 items-center">
                    {/* Action Buttons */}
                    {isReceived ? (
                      // Bill To (Receiver/Buyer): Can approve/decline for PENDING or APPROVED status
                      <>
                        {(inv.status?.toLowerCase() === "pending" || inv.status?.toLowerCase() === "approved") && (
                          <InvoiceActionButtons invoiceId={inv.invoice_number} />
                        )}
                      </>
                    ) : (
                      // Bill From (Sender/Seller): Can edit, delete, and mark as paid
                      <>
                        <Link href={`/dashboard/invoices/${inv.invoice_number}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        {inv.status?.toLowerCase() === "approved" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleMarkAsPaid(inv.invoice_number)}
                          >
                            Mark as Paid
                          </Button>
                        )}
                        <DeleteInvoiceButton invoiceId={inv.invoice_number} />
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-white">Invoices</h1>
        <div className="flex gap-2">
          <ExportButtons dataType="invoices" />
          <Link href="/dashboard/invoices/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="sent">Sent ({sentInvoices.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedInvoices.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="sent" className="mt-4">
          <InvoiceTable invoiceList={sentInvoices} isReceived={false} />
        </TabsContent>
        <TabsContent value="received" className="mt-4">
          <InvoiceTable invoiceList={receivedInvoices} isReceived={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
