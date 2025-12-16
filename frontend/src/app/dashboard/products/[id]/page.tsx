import { fetchGraphQL } from "@/lib/graphql";
import { ProductForm } from "@/components/forms/ProductForm";
import { ProductSummaryChat } from "@/components/ProductSummaryChat";
import { GenerateProductSummaryButton } from "@/components/GenerateProductSummaryButton";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product } = await fetchGraphQL(
    `query GetProduct($id: String!) { 
      product(id: $id) { 
        id 
        name 
        description 
        price 
        stock 
      } 
    }`,
    { id }
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <GenerateProductSummaryButton product={product} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductForm product={product} />
        </div>
        <div className="lg:col-span-1">
          <ProductSummaryChat product={product} />
        </div>
      </div>
    </div>
  );
}
