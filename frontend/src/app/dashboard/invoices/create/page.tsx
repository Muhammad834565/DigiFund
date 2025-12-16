import { fetchGraphQL } from "@/lib/graphql";
import { InvoiceBuilder } from "@/components/forms/InvoiceBuilder";

export default async function CreateInvoicePage() {
  // Fetch dependencies in parallel
  const [customersData, suppliersData, inventoryData] = await Promise.all([
    fetchGraphQL(`query { customers { id name } }`),
    fetchGraphQL(`
      query {
        getSuppliers {
          id
          supplier_public_id
          company_name
        }
      }
    `),
    fetchGraphQL(`
      query {
        getInventory {
          id
          inventory_id
          description
          price
          quantity
          unit_price
          sku
        }
      }
    `),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Create New Invoice
      </h1>
      <InvoiceBuilder
        customers={customersData.customers || []}
        suppliers={suppliersData.getSuppliers || []}
        inventory={inventoryData.getInventory || []}
      />
    </div>
  );
}
