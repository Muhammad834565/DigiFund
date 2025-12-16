import { fetchGraphQL } from "@/lib/graphql";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function PrintInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Fetch invoice data
  const { getInvoiceByNumber: invoice } = await fetchGraphQL(
    `query GetInvoiceByNumber($invoice_number: String!) {
      getInvoiceByNumber(invoice_number: $invoice_number) {
        id
        invoice_number
        invoice_type
        status
        total_amount
        created_at
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
    }`,
    { invoice_number: id }
  );

  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white text-black">
      {/* Print-specific CSS to auto-trigger print dialog or styling can be added here */}

      {/* Header */}
      <div className="flex justify-between items-start border-b pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
          <p className="text-sm text-gray-500 mt-1">
            #{invoice.invoice_number}
          </p>
        </div>
        <div className="text-right">
          <h2 className="font-semibold text-xl">My Company Inc.</h2>
          <p className="text-sm text-gray-500">123 Tech Street</p>
          <p className="text-sm text-gray-500">Karachi, Pakistan</p>
        </div>
      </div>

      {/* Bill To & Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-2">
            Bill To
          </h3>
          <p className="font-bold">{invoice.bill_to_name}</p>
          <p className="text-sm">{invoice.bill_to_email}</p>
          <p className="text-sm">{invoice.bill_to_address}</p>
          <p className="text-sm">{invoice.bill_to_phone}</p>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Invoice Date:</span>
              <span className="font-medium">
                {formatDate(invoice.created_at)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Status:</span>
              <span className="font-medium uppercase">{invoice.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-3 px-2">Inventory ID</th>
              <th className="text-right py-3 px-2">Qty</th>
              <th className="text-right py-3 px-2">Rate</th>
              <th className="text-right py-3 px-2">Discount %</th>
              <th className="text-right py-3 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item: any) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2 font-mono text-sm">{item.inventory_id}</td>
                <td className="text-right py-3 px-2">{item.qty}</td>
                <td className="text-right py-3 px-2">${item.rate.toFixed(2)}</td>
                <td className="text-right py-3 px-2">{item.discount_percentage}%</td>
                <td className="text-right py-3 px-2 font-semibold">
                  ${item.total_price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="mb-8 pb-8 border-b">
        <div className="flex justify-end">
          <div className="w-1/3 border-t-2 border-black pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total</span>
              <span className="text-xl font-bold">
                ${invoice.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="mt-20 pt-8 border-t text-center text-sm text-gray-400 print:hidden">
        <p>Press Ctrl+P (Cmd+P) to save as PDF</p>
      </div>
    </div>
  );
}
