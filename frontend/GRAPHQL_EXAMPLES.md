# Complete Example - Using Generated GraphQL Hooks

This is a complete, working example showing how to use the generated hooks in a real Next.js page.

## 📁 Example File Structure

```
src/app/dashboard/invoices/page.tsx  ← Example below
```

---

## 🎯 Complete Invoice Management Page

```tsx
"use client";

import {
  useGetAllInvoicesQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetAllCustomersQuery,
  useGetAllProductsQuery,
} from "@/graphql/generated/graphql";
import { useState } from "react";

export default function InvoicesPage() {
  // Fetch data
  const {
    data: invoicesData,
    loading: invoicesLoading,
    refetch,
  } = useGetAllInvoicesQuery();
  const { data: customersData } = useGetAllCustomersQuery();
  const { data: productsData } = useGetAllProductsQuery();

  // Mutations
  const [createInvoice, { loading: creating }] = useCreateInvoiceMutation({
    onCompleted: () => {
      refetch(); // Refresh list after creating
      setShowForm(false);
      alert("Invoice created!");
    },
  });

  const [deleteInvoice] = useDeleteInvoiceMutation({
    onCompleted: () => {
      refetch(); // Refresh list after deleting
    },
  });

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Handlers
  const handleCreate = async () => {
    if (!selectedCustomer || !selectedProduct) {
      alert("Please select customer and product");
      return;
    }

    await createInvoice({
      variables: {
        input: {
          customerId: selectedCustomer,
          items: [{ productId: selectedProduct, qty: quantity }],
        },
      },
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this invoice?")) {
      await deleteInvoice({ variables: { id } });
    }
  };

  if (invoicesLoading) {
    return <div className="p-8">Loading invoices...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create Invoice"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">New Invoice</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Customer</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Customer</option>
                {customersData?.customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Product</option>
                {productsData?.products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {creating ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </div>
      )}

      {/* Invoices List */}
      <div className="space-y-4">
        {invoicesData?.invoices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No invoices yet</p>
        ) : (
          invoicesData?.invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-6 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Invoice #{invoice.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{invoice.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="font-medium">{invoice.createdBy.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-medium text-lg">
                    ${invoice.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-2 py-1 text-sm rounded ${
                      invoice.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## 🎨 Styling Note

This example uses Tailwind CSS classes. If you're not using Tailwind, replace with your own CSS:

```tsx
// Without Tailwind - use regular className
<div className="invoice-page">
  <h1 className="page-title">Invoices</h1>
  {/* ... */}
</div>
```

And add your CSS:

```css
/* app/dashboard/invoices/styles.css */
.invoice-page {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
}
```

---

## 🔑 Key Patterns Used

### 1. **Fetching Data**

```tsx
const { data, loading, error } = useGetAllInvoicesQuery();
```

### 2. **Creating Data**

```tsx
const [createInvoice, { loading: creating }] = useCreateInvoiceMutation({
  onCompleted: () => {
    refetch(); // Refresh the list
  }
});

await createInvoice({
  variables: { input: { ... } }
});
```

### 3. **Deleting Data**

```tsx
const [deleteInvoice] = useDeleteInvoiceMutation({
  onCompleted: () => refetch(),
});

await deleteInvoice({ variables: { id } });
```

### 4. **TypeScript Type Safety**

```tsx
// TypeScript knows the exact shape of your data!
invoice.customer.name; // ✅ Autocomplete works
invoice.customer.invalid; // ❌ TypeScript error
```

---

## 🚀 More Examples

### Simple Customer List

```tsx
"use client";
import { useGetAllCustomersQuery } from "@/graphql/generated/graphql";

export default function CustomersPage() {
  const { data, loading } = useGetAllCustomersQuery();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Customers</h1>
      <ul>
        {data?.customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} - {customer.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Login Page

```tsx
"use client";
import { useLoginMutation } from "@/graphql/generated/graphql";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, { loading, error }] = useLoginMutation({
    onCompleted: (data) => {
      // Save token to cookie or localStorage
      document.cookie = `access_token=${data.login.access_token}`;
      router.push("/dashboard");
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ variables: { input: { email, password } } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### Real-time Chat

```tsx
"use client";
import {
  useMessageReceivedSubscription,
  useSendChatMessageMutation,
} from "@/graphql/generated/graphql";
import { useState } from "react";

export default function ChatRoom({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("");
  const userId = "your-user-id"; // Get from auth context

  // Subscribe to new messages
  const { data } = useMessageReceivedSubscription({
    variables: { roomId },
  });

  // Send message mutation
  const [sendMessage] = useSendChatMessageMutation();

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      variables: {
        input: {
          roomId,
          senderId: userId,
          message,
        },
      },
    });

    setMessage("");
  };

  return (
    <div>
      <h2>Chat Room</h2>

      {/* Display latest message */}
      {data?.messageReceived && (
        <div className="message">
          <strong>{data.messageReceived.senderId}:</strong>
          <p>{data.messageReceived.message}</p>
          <small>
            {new Date(data.messageReceived.createdAt).toLocaleTimeString()}
          </small>
        </div>
      )}

      {/* Send message */}
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
```

---

## 💡 Tips

1. **Always handle loading and error states**

   ```tsx
   if (loading) return <div>Loading...</div>;
   if (error) return <div>Error: {error.message}</div>;
   ```

2. **Use `refetch()` to refresh data after mutations**

   ```tsx
   const { data, refetch } = useGetAllInvoicesQuery();
   // ... after creating/deleting
   refetch();
   ```

3. **Use `onCompleted` callback for side effects**

   ```tsx
   const [createInvoice] = useCreateInvoiceMutation({
     onCompleted: (data) => {
       console.log("Created:", data);
       refetch();
     },
   });
   ```

4. **TypeScript will help you!**
   - Hover over variables to see types
   - Use autocomplete (Ctrl+Space)
   - Check errors before running

---

**Now you have complete, working examples to get started! 🚀**
