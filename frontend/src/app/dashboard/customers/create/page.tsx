import { CustomerForm } from "@/components/forms/CustomerForm";

export default function CreateCustomerPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Create Customer
      </h1>
      <CustomerForm />
    </div>
  );
}
