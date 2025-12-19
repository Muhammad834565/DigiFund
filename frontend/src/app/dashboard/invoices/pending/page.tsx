"use client";

import { useGetMyInvoicesQuery, useUpdateInvoiceStatusMutation } from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function PendingInvoicesPage() {
  const { data, loading, error, refetch } = useGetMyInvoicesQuery();
  const [updateStatus] = useUpdateInvoiceStatusMutation();

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  const pendingInvoices = data?.getInvoices?.filter(
    (invoice: any) => invoice.status === "pending"
  ) || [];

  const handleStatusUpdate = async (invoiceNumber: string, status: string) => {
    try {
      await updateStatus({
        variables: { input: { invoice_number: invoiceNumber, status } },
      });
      refetch();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pending Invoices</h1>
      {pendingInvoices.length === 0 ? (
        <p>No pending invoices.</p>
      ) : (
        <div className="grid gap-4">
          {pendingInvoices.map((invoice: any) => (
            <Card key={invoice.id}>
              <CardHeader>
                <CardTitle>{invoice.invoice_number}</CardTitle>
                <Badge variant="secondary">{invoice.status}</Badge>
              </CardHeader>
              <CardContent>
                <p>From: {invoice.bill_from_name}</p>
                <p>To: {invoice.bill_to_name}</p>
                <p>Total: ${invoice.total_amount}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() =>
                      handleStatusUpdate(invoice.invoice_number, "clear")
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleStatusUpdate(invoice.invoice_number, "disapproved")
                    }
                  >
                    Disapprove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
