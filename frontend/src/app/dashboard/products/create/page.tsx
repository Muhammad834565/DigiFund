import { ProductForm } from "@/components/forms/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Create Product
      </h1>
      <ProductForm />
    </div>
  );
}
