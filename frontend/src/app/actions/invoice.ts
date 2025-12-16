"use server";

import { fetchGraphQL } from "@/lib/graphql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Get all invoices for the logged-in user
export async function getMyInvoicesAction() {
  const query = `
    query GetMyInvoices {
      get_my_invoices {
        invoice_id
        invoice_number
        bill_from_name
        bill_from_email
        bill_from_phone
        bill_from_address
        bill_to_public_id
        bill_to_name
        bill_to_email
        bill_to_phone
        bill_to_address
        items {
          inventory_id
          description
          qty
          rate
          discount
        }
        status
        created_at
      }
    }
  `;

  try {
    const response = await fetchGraphQL(query, {});
    return { invoices: response.get_my_invoices };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch invoices" };
  }
}

// Get a specific invoice by invoice number
export async function getInvoiceByNumberAction(invoice_number: string) {
  const query = `
    query GetInvoiceByNumber($invoice_number: String!) {
      get_invoice_by_number(invoice_number: $invoice_number) {
        invoice_id
        invoice_number
        bill_from_name
        bill_from_email
        bill_from_phone
        bill_from_address
        bill_to_public_id
        bill_to_name
        bill_to_email
        bill_to_phone
        bill_to_address
        items {
          inventory_id
          description
          qty
          rate
          discount
        }
        status
        created_at
      }
    }
  `;

  try {
    const response = await fetchGraphQL(query, { invoice_number });
    return { invoice: response.get_invoice_by_number };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch invoice" };
  }
}

// Get pending invoices (for receiver to approve/disapprove)
export async function getPendingInvoicesAction() {
  const query = `
    query GetPendingInvoices {
      get_pending_invoices {
        invoice_id
        invoice_number
        bill_from_name
        bill_from_email
        bill_from_phone
        bill_from_address
        bill_to_public_id
        bill_to_name
        bill_to_email
        bill_to_phone
        bill_to_address
        items {
          inventory_id
          description
          qty
          rate
          discount
        }
        status
        created_at
      }
    }
  `;

  try {
    const response = await fetchGraphQL(query, {});
    return { invoices: response.get_pending_invoices };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch pending invoices" };
  }
}

// Create a new invoice (with email, phone, or public_id lookup)
export async function createInvoiceAction(data: {
  recipientType: "customer" | "supplier";
  recipientId: string;
  recipientDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    inventoryId: string;
    qty: number;
    discountPercentage?: number;
    rate?: number;
  }[];
}) {
  const mutation = `
    mutation CreateInvoice($input: CreateInvoiceInput!) {
      createInvoice(input: $input) {
        id
        invoice_number
        status
        bill_from_public_id
        bill_to_public_id
        total_amount
        items {
          id
          inventory_id
          qty
          rate
        }
      }
    }
  `;

  try {
    // Transform form data to match GraphQL input
    let input: any = {
      items: data.items.map(item => ({
        inventory_id: item.inventoryId,
        qty: item.qty,
        rate: item.rate || 0, // Use provided rate or default to 0
        discount_percentage: item.discountPercentage || 0
      }))
    };

    if (data.recipientType === "supplier") {
      // Suppliers are system users, use public ID
      input.bill_to_public_id = data.recipientId;
    } else {
      // Customers might be offline/manual, send details
      // If the backend requires bill_to_public_id to be absent for manual entry:
      if (data.recipientDetails) {
        // Schema only supports email and phone for manual entry based on latest generated types
        if (data.recipientDetails.email) input.bill_to_email = data.recipientDetails.email;
        if (data.recipientDetails.phone) input.bill_to_phone = data.recipientDetails.phone;
        // bill_to_name and bill_to_address are excluded as they are not in CreateInvoiceInput
      }
      // Do not set bill_to_public_id for customers as they are manual entries and ID is internal
    }

    await fetchGraphQL(mutation, { input });
  } catch (error: any) {
    return { error: error.message || "Failed to create invoice" };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Update an existing invoice
export async function updateInvoiceAction(data: {
  invoice_number: string;
  bill_to_email?: string;
  bill_to_phone?: string;
  bill_to_public_id?: string;
  items?: {
    inventory_id: string;
    qty: number;
    rate: number;
    discount?: number;
  }[];
}) {
  const mutation = `
    mutation UpdateInvoice($invoice_number: String!, $input: UpdateInvoiceInput!) {
      updateInvoice(invoice_number: $invoice_number, input: $input) {
        id
        invoice_number
        status
        total_amount
        items {
          id
          inventory_id
          qty
          rate
        }
      }
    }
  `;

  try {
    await fetchGraphQL(mutation, data);
    revalidatePath("/dashboard/invoices");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update invoice" };
  }
}

// Delete an invoice
export async function deleteInvoiceAction(invoice_number: string) {
  const mutation = `
    mutation DeleteInvoice($invoice_number: String!) {
      deleteInvoice(invoice_number: $invoice_number) {
        invoice_number
        status
        total_amount
      }
    }
  `;

  try {
    await fetchGraphQL(mutation, { invoice_number });
    revalidatePath("/dashboard/invoices");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete invoice" };
  }
}

// Approve a pending invoice (receiver only)
export async function approveInvoiceAction(invoice_number: string) {
  const mutation = `
    mutation UpdateInvoiceStatus($input: UpdateInvoiceStatusInput!) {
      updateInvoiceStatus(input: $input) {
        id
        invoice_number
        status
      }
    }
  `;

  try {
    await fetchGraphQL(mutation, {
      input: {
        invoice_number,
        status: "approved",
      },
    });
    revalidatePath("/dashboard/invoices/pending");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to approve invoice" };
  }
}

// Disapprove a pending invoice (receiver only)
export async function disapproveInvoiceAction(invoice_number: string) {
  const mutation = `
    mutation UpdateInvoiceStatus($input: UpdateInvoiceStatusInput!) {
      updateInvoiceStatus(input: $input) {
        id
        invoice_number
        status
      }
    }
  `;

  try {
    await fetchGraphQL(mutation, {
      input: {
        invoice_number,
        status: "declined",
      },
    });
    revalidatePath("/dashboard/invoices/pending");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to disapprove invoice" };
  }
}
// Update invoice status
export async function updateInvoiceStatusAction(invoice_number: string, status: string) {
  const mutation = `
    mutation UpdateInvoiceStatus($input: UpdateInvoiceStatusInput!) {
      updateInvoiceStatus(input: $input) {
        id
        invoice_number
        status
        updated_at
      }
    }
  `;

  try {
    await fetchGraphQL(mutation, {
      input: {
        invoice_number,
        status,
      },
    });
    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoice_number}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update invoice status" };
  }
}
