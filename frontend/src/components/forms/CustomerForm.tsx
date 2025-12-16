"use client";

import { useFormState } from "react-dom"; // or react-dom/client in some versions
import { useOptimistic, useRef } from "react";
import { updateCustomer, createCustomer } from "@/app/actions/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerForm({ customer }: { customer?: any }) {
  const action = customer
    ? updateCustomer.bind(null, customer.id)
    : createCustomer;
  const [state, formAction] = useFormState(action, {} as any);
  const ref = useRef<HTMLFormElement>(null);

  // Optimistic UI Hook
  const [optimisticCustomer, setOptimisticCustomer] = useOptimistic(
    customer || {},
    (state, newCustomer: any) => ({ ...state, ...newCustomer })
  );

  return (
    <form
      ref={ref}
      action={async (formData) => {
        // Immediate UI update before server request
        setOptimisticCustomer(Object.fromEntries(formData));
        await formAction(formData);
      }}
      className="space-y-4 border dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800 shadow-sm"
    >
      <div>
        <Label>Name</Label>
        <Input name="name" defaultValue={optimisticCustomer.name} />
        {state.errors?.name && (
          <p className="text-red-500 text-sm">{state.errors.name}</p>
        )}
      </div>

      <div>
        <Label>Email</Label>
        <Input name="email" defaultValue={optimisticCustomer.email} />
        {state.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input name="phone" defaultValue={optimisticCustomer.phone} />
        </div>
        <div>
          <Label>Address</Label>
          <Input name="address" defaultValue={optimisticCustomer.address} />
        </div>
      </div>

      <Button type="submit" disabled={false}>
        {customer ? "Update Customer" : "Create Customer"}
      </Button>
    </form>
  );
}
