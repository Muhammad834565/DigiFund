import { fetchGraphQL } from "@/lib/graphql";
import { CustomerForm } from "@/components/forms/CustomerForm";

// Remove static generation - use dynamic rendering for authenticated pages
export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { customer } = await fetchGraphQL(
    `query GetCustomer($id: String!) { customer(id: $id) { id name email phone address } }`,
    { id }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Customer</h1>
      <CustomerForm customer={customer} />
    </div>
  );
}
