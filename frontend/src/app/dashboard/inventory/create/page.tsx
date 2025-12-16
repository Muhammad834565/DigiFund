import { InventoryForm } from "@/components/forms/InventoryForm";

export default function CreateInventoryPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Create Inventory Item
      </h1>
      <InventoryForm />
    </div>
  );
}
