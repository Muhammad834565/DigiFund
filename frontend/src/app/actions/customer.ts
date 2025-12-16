"use server";

import { fetchGraphQL } from "@/lib/graphql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Zod Schema - not exported because "use server" files can only export async functions
const CustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(5),
});

export async function createCustomer(prevState: any, formData: FormData) {
  const validated = CustomerSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const mutation = `
    mutation CreateCustomer($input: CreateCustomerInput!) {
      createCustomer(input: $input) { id }
    }
  `;

  try {
    await fetchGraphQL(mutation, { input: validated.data });
  } catch (e) {
    return { message: "Failed to create customer" };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  prevState: any,
  formData: FormData
) {
  const validated = CustomerSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success)
    return { errors: validated.error.flatten().fieldErrors };

  const mutation = `
    mutation UpdateCustomer($id: String!, $input: UpdateCustomerInput!) {
      updateCustomer(id: $id, input: $input) { id }
    }
  `;

  try {
    // Note: Your GraphQL schema requires 'id' inside input as well based on prompt
    await fetchGraphQL(mutation, {
      id,
      input: { id, ...validated.data },
    });
  } catch (e) {
    return { message: "Failed to update" };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  const mutation = `mutation DeleteCustomer($id: String!) { deleteCustomer(id: $id) }`;

  try {
    await fetchGraphQL(mutation, { id });
    revalidatePath("/dashboard/customers");
  } catch (e: any) {
    // Return error message for foreign key constraint violations
    if (e.message?.includes("foreign key constraint")) {
      return {
        error:
          "Cannot delete customer with existing invoices. Please delete all associated invoices first.",
      };
    }
    return { error: "Failed to delete customer" };
  }
}
