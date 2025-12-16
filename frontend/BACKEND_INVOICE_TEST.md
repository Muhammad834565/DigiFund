# Backend Invoice Schema Test

Use these queries in your GraphQL playground (http://localhost:3000/graphql) to verify what fields your backend supports:

## Test Query 1: Get All Invoices

```graphql
query TestGetInvoices {
  getInvoices {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_from_name
    bill_from_email
    bill_from_phone
    bill_from_address
    bill_from_status
    bill_to_public_id
    bill_to_name
    bill_to_email
    bill_to_phone
    bill_to_address
    bill_to_status
    invoice_date
    total_amount
    notes
    created_at
    updated_at
    items {
      id
      inventory_id
      description
      qty
      rate
      discount_percentage
      total_price
    }
  }
}
```

## Test Query 2: Get Single Invoice

```graphql
query TestGetInvoiceByNumber($invoice_number: String!) {
  getInvoiceByNumber(invoice_number: $invoice_number) {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_from_name
    bill_from_email
    bill_from_phone
    bill_from_address
    bill_from_status
    bill_to_public_id
    bill_to_name
    bill_to_email
    bill_to_phone
    bill_to_address
    bill_to_status
    invoice_date
    total_amount
    notes
    created_at
    updated_at
    items {
      id
      inventory_id
      description
      qty
      rate
      discount_percentage
      total_price
    }
  }
}
```

## Test Mutation 1: Create Invoice

```graphql
mutation TestCreateInvoice {
  createInvoice(
    input: {
      bill_to_email: "test@example.com"
      # OR bill_to_phone: "+1234567890"
      # OR bill_to_public_id: "some_public_id"
      items: [
        { inventory_id: 1, qty: 2, rate: 100.00, discount_percentage: 10 }
      ]
      notes: "Test invoice"
    }
  ) {
    id
    invoice_number
    status
    total_amount
  }
}
```

## Test Mutation 2: Update Invoice

```graphql
mutation TestUpdateInvoice($invoice_number: String!) {
  updateInvoice(
    invoice_number: $invoice_number
    input: {
      items: [{ inventory_id: 1, qty: 3, rate: 100.00, discount_percentage: 5 }]
      notes: "Updated notes"
    }
  ) {
    invoice_number
    total_amount
    updated_at
  }
}
```

## Test Mutation 3: Approve Invoice

```graphql
mutation TestApproveInvoice($invoice_number: String!) {
  approveInvoice(invoice_number: $invoice_number) {
    invoice_number
    status
  }
}
```

## Test Mutation 4: Disapprove Invoice

```graphql
mutation TestDisapproveInvoice($invoice_number: String!) {
  disapproveInvoice(invoice_number: $invoice_number) {
    invoice_number
    status
  }
}
```

## Test Mutation 5: Delete Invoice

```graphql
mutation TestDeleteInvoice($invoice_number: String!) {
  deleteInvoice(invoice_number: $invoice_number) {
    invoice_number
    status
    total_amount
  }
}
```

## Instructions:

1. Run these queries in GraphQL Playground
2. Note any errors about missing or incorrect fields
3. Share the error messages or successful responses with me
4. I'll update the frontend GraphQL files to match exactly what your backend supports

## Common Field Variations to Check:

- `id` vs `invoice_id`
- `total_amount` vs `total` vs `amount`
- `created_at` vs `createdAt`
- `inventory_id` vs `product_id` vs `item_id`
- `discount_percentage` vs `discount`
- `bill_from_*` vs `sender_*` vs `from_*`
- `bill_to_*` vs `receiver_*` vs `to_*`
