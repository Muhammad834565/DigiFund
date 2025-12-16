import { fetchGraphQL } from "@/lib/graphql";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Printer, ArrowLeft } from "lucide-react";

import { InvoiceActions } from "@/components/InvoiceActions";

// ... existing imports ...

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the invoice details
  const { getInvoiceByNumber: invoice } = await fetchGraphQL(
    `
    query GetInvoiceByNumber($invoice_number: String!) {
      getInvoiceByNumber(invoice_number: $invoice_number) {
        id
        invoice_number
        invoice_type
        status
        total_amount
        created_at
        bill_from_public_id
        bill_to_public_id
        bill_from_name
        bill_from_email
        bill_from_phone
        bill_from_address
        bill_to_name
        bill_to_email
        bill_to_phone
        bill_to_address
        invoice_date
        items {
          id
          inventory_id
          qty
          rate
          discount_percentage
          total_price
        }
      }
    }
    `,
    { invoice_number: id }
  );

  // Fetch current user profile
  const { me: currentUser } = await fetchGraphQL(
    `
    query GetMyProfile {
      me {
        public_id
      }
    }
    `,
    {}
  );

  if (!invoice) return <div>Invoice not found</div>;

  // Determine if the current user is the sender
  const isSender = currentUser?.public_id === invoice.bill_from_public_id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/dashboard/invoices">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Invoices
          </Button>
        </Link>
        <div className="flex gap-2">
          {/* Actions (Delete, Edit, Approve, Decline, Mark as Paid) */}
          <InvoiceActions
            invoiceNumber={invoice.invoice_number}
            status={invoice.status}
            isSender={isSender}
          />

          {/* Link to the dedicated Print Page */}
          <Link
            href={`/print/invoice/${invoice.invoice_number}`}
            target="_blank"
          >
            <Button>
              <Printer className="w-4 h-4 mr-2" /> Print / PDF
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice #{invoice.invoice_number}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{formatDate(invoice.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={invoice.status === "PAID" ? "default" : "secondary"}
              >
                {invoice.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-lg">
                ${invoice.total_amount.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="font-semibold">{invoice.bill_to_name}</div>
            <div className="text-sm text-muted-foreground">
              {invoice.bill_to_email}
            </div>
            <div className="text-sm text-muted-foreground">
              {invoice.bill_to_phone}
            </div>
            <div className="text-sm text-muted-foreground">
              {invoice.bill_to_address}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inventory ID</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Discount %</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.inventory_id}</TableCell>
                  <TableCell className="text-right">{item.qty}</TableCell>
                  <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.discount_percentage}%</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${item.total_price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
