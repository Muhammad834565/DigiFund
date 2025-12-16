# 🚀 GraphQL Setup & Usage Guide

## 📁 Project Structure

Your GraphQL operations are now organized in a clean, maintainable structure:

```
src/graphql/
├── queries/           # All GraphQL queries
│   ├── users.graphql
│   ├── dashboard.graphql
│   ├── customers.graphql
│   ├── products.graphql
│   ├── invoices.graphql
│   └── chat.graphql
├── mutations/         # All GraphQL mutations
│   ├── auth.graphql
│   ├── customers.graphql
│   ├── products.graphql
│   ├── invoices.graphql
│   └── chat.graphql
├── subscriptions/     # All GraphQL subscriptions
│   ├── dashboard.graphql
│   └── chat.graphql
└── generated/         # Auto-generated TypeScript code (created after running codegen)
    └── graphql.ts
```

---

## 🎯 What is GraphQL Code Generation?

GraphQL Code Generation automatically creates **TypeScript types** and **React hooks** from your `.graphql` files. This gives you:

✅ **Type Safety** - Catch errors at compile-time, not runtime  
✅ **Auto-completion** - IntelliSense for all your queries/mutations  
✅ **React Hooks** - Ready-to-use hooks like `useGetAllUsersQuery()`  
✅ **Less Boilerplate** - No need to manually write types or hooks

---

## 🛠️ Step-by-Step Setup

### Step 1: Make Sure Your Backend is Running

Before generating code, ensure your GraphQL backend server is running:

```bash
# In your backend project
npm run start:dev
```

Your GraphQL server should be accessible at: `http://localhost:3000/graphql`

---

### Step 2: Generate TypeScript Code

Run the code generator to create TypeScript types and hooks:

```bash
npm run codegen
```

**What this does:**

- Connects to your GraphQL backend at `http://localhost:3000/graphql`
- Reads all `.graphql` files in `src/graphql/`
- Downloads the GraphQL schema from your backend
- Generates TypeScript types and React hooks
- Creates `src/graphql/generated/graphql.ts`

**Optional: Watch Mode**

For development, use watch mode to auto-regenerate on file changes:

```bash
npm run codegen:watch
```

This will automatically regenerate types whenever you:

- Modify any `.graphql` file
- Change your backend schema

---

### Step 3: Import and Use Generated Hooks

After running codegen, you can import and use the generated hooks in your React components.

#### Example 1: Fetching Users (Query)

```tsx
// src/app/dashboard/users/page.tsx
"use client";

import { useGetAllUsersQuery } from "@/graphql/generated/graphql";

export default function UsersPage() {
  const { data, loading, error } = useGetAllUsersQuery();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Example 2: Creating a Customer (Mutation)

```tsx
// src/components/forms/CustomerForm.tsx
"use client";

import { useCreateCustomerMutation } from "@/graphql/generated/graphql";
import { useState } from "react";

export default function CustomerForm() {
  const [createCustomer, { loading, error }] = useCreateCustomerMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createCustomer({
        variables: {
          input: formData,
        },
      });

      console.log("Customer created:", result.data?.createCustomer);
      // Redirect or show success message
    } catch (err) {
      console.error("Error creating customer:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Customer"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

#### Example 3: Real-time Dashboard Stats (Subscription)

```tsx
// src/app/dashboard/page.tsx
"use client";

import { useDashboardLiveStatsSubscription } from "@/graphql/generated/graphql";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardLiveStatsSubscription();

  if (loading) return <div>Connecting to live updates...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const stats = data?.dashboardStatsUpdated;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        <h3>Total Customers</h3>
        <p className="text-3xl">{stats?.totalCustomers || 0}</p>
      </div>
      <div className="p-4 border rounded">
        <h3>Total Products</h3>
        <p className="text-3xl">{stats?.totalProducts || 0}</p>
      </div>
      <div className="p-4 border rounded">
        <h3>Total Revenue</h3>
        <p className="text-3xl">${stats?.totalRevenue || 0}</p>
      </div>
      <div className="p-4 border rounded">
        <h3>Total Invoices</h3>
        <p className="text-3xl">{stats?.totalInvoices || 0}</p>
      </div>
      <div className="p-4 border rounded">
        <h3>Active Users</h3>
        <p className="text-3xl">{stats?.activeUsers || 0}</p>
      </div>
      <div className="p-4 border rounded">
        <h3>Pending Invoices</h3>
        <p className="text-3xl">{stats?.pendingInvoices || 0}</p>
      </div>
    </div>
  );
}
```

#### Example 4: Chat Room with Real-time Messages (Subscription)

```tsx
// src/app/dashboard/chat/[roomId]/page.tsx
"use client";

import {
  useMessageReceivedSubscription,
  useSendChatMessageMutation,
} from "@/graphql/generated/graphql";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const { data } = useMessageReceivedSubscription({
    variables: { roomId },
  });

  const [sendMessage] = useSendChatMessageMutation();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      variables: {
        input: {
          roomId,
          senderId: "YOUR_USER_ID", // Get from auth context
          message,
        },
      },
    });

    setMessage("");
  };

  return (
    <div>
      <div className="messages">
        {data?.messageReceived && (
          <div>
            <strong>{data.messageReceived.senderId}:</strong>
            <p>{data.messageReceived.message}</p>
            <small>
              {new Date(data.messageReceived.createdAt).toLocaleTimeString()}
            </small>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
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

## 📝 Available Operations

### Queries (Fetching Data)

| Hook                                   | File                        | Description                |
| -------------------------------------- | --------------------------- | -------------------------- |
| `useGetAllUsersQuery()`                | `queries/users.graphql`     | Fetch all users            |
| `useGetUserByIdQuery({ id })`          | `queries/users.graphql`     | Fetch user by ID           |
| `useGetDashboardStatsQuery()`          | `queries/dashboard.graphql` | Fetch dashboard statistics |
| `useGetAllCustomersQuery()`            | `queries/customers.graphql` | Fetch all customers        |
| `useGetCustomerByIdQuery({ id })`      | `queries/customers.graphql` | Fetch customer by ID       |
| `useGetAllProductsQuery()`             | `queries/products.graphql`  | Fetch all products         |
| `useGetProductByIdQuery({ id })`       | `queries/products.graphql`  | Fetch product by ID        |
| `useGetAllInvoicesQuery()`             | `queries/invoices.graphql`  | Fetch all invoices         |
| `useGetInvoiceByIdQuery({ id })`       | `queries/invoices.graphql`  | Fetch invoice by ID        |
| `useGetRoomMessagesQuery({ roomId })`  | `queries/chat.graphql`      | Fetch chat room messages   |
| `useGetUserChatRoomsQuery({ userId })` | `queries/chat.graphql`      | Fetch user's chat rooms    |

### Mutations (Modifying Data)

| Hook                           | File                          | Description       |
| ------------------------------ | ----------------------------- | ----------------- |
| `useLoginMutation()`           | `mutations/auth.graphql`      | Login user        |
| `useSignupMutation()`          | `mutations/auth.graphql`      | Register new user |
| `useLogoutMutation()`          | `mutations/auth.graphql`      | Logout user       |
| `useCreateCustomerMutation()`  | `mutations/customers.graphql` | Create customer   |
| `useUpdateCustomerMutation()`  | `mutations/customers.graphql` | Update customer   |
| `useDeleteCustomerMutation()`  | `mutations/customers.graphql` | Delete customer   |
| `useCreateProductMutation()`   | `mutations/products.graphql`  | Create product    |
| `useUpdateProductMutation()`   | `mutations/products.graphql`  | Update product    |
| `useDeleteProductMutation()`   | `mutations/products.graphql`  | Delete product    |
| `useCreateInvoiceMutation()`   | `mutations/invoices.graphql`  | Create invoice    |
| `useUpdateInvoiceMutation()`   | `mutations/invoices.graphql`  | Update invoice    |
| `useDeleteInvoiceMutation()`   | `mutations/invoices.graphql`  | Delete invoice    |
| `useCreateChatRoomMutation()`  | `mutations/chat.graphql`      | Create chat room  |
| `useSendChatMessageMutation()` | `mutations/chat.graphql`      | Send chat message |
| `useJoinChatRoomMutation()`    | `mutations/chat.graphql`      | Join chat room    |

### Subscriptions (Real-time Updates)

| Hook                                         | File                              | Description          |
| -------------------------------------------- | --------------------------------- | -------------------- |
| `useDashboardLiveStatsSubscription()`        | `subscriptions/dashboard.graphql` | Live dashboard stats |
| `useMessageReceivedSubscription({ roomId })` | `subscriptions/chat.graphql`      | Live chat messages   |
| `useRoomUpdatedSubscription({ roomId })`     | `subscriptions/chat.graphql`      | Live room updates    |

---

## 🎨 Hook API Reference

### Query Hook Pattern

```tsx
const { data, loading, error, refetch } = useQueryNameQuery({
  variables: { id: "123" },
  skip: false, // Skip query execution
  fetchPolicy: "cache-first", // How to use cache
});
```

### Mutation Hook Pattern

```tsx
const [mutationName, { data, loading, error }] = useMutationNameMutation({
  onCompleted: (data) => {
    // Called when mutation succeeds
  },
  onError: (error) => {
    // Called when mutation fails
  },
  refetchQueries: ['GetAllCustomers'], // Refresh these queries after mutation
});

// Execute mutation
await mutationName({
  variables: {
    input: { ... }
  }
});
```

### Subscription Hook Pattern

```tsx
const { data, loading, error } = useSubscriptionNameSubscription({
  variables: { roomId: "123" },
  onData: ({ data }) => {
    // Called when new data arrives
  },
  skip: false, // Conditionally skip subscription
});
```

---

## 🔄 Development Workflow

### 1. Add a New Query/Mutation/Subscription

1. Create or edit a `.graphql` file in the appropriate folder
2. Write your GraphQL operation
3. Run `npm run codegen` to generate the hook
4. Import and use the hook in your component

**Example: Adding a new query**

```graphql
# src/graphql/queries/products.graphql
query GetFeaturedProducts {
  featuredProducts {
    id
    name
    price
  }
}
```

```bash
npm run codegen
```

```tsx
// Your component
import { useGetFeaturedProductsQuery } from "@/graphql/generated/graphql";

const { data } = useGetFeaturedProductsQuery();
```

### 2. When Backend Schema Changes

If your backend GraphQL schema is updated:

```bash
npm run codegen
```

This will:

- Download the latest schema
- Update all TypeScript types
- Fix any breaking changes (TypeScript will show errors)

### 3. Daily Development

Keep codegen running in watch mode:

```bash
npm run codegen:watch
```

Now any changes to `.graphql` files will automatically regenerate types!

---

## ⚙️ Configuration Details

### `codegen.yml` Explained

```yaml
schema: http://localhost:3000/graphql # Your GraphQL endpoint
documents:
  - "src/graphql/**/*.graphql" # Where to find .graphql files
generates:
  src/graphql/generated/graphql.ts: # Output file
    plugins:
      - typescript # Generate TypeScript types
      - typescript-operations # Generate operation types
      - typescript-react-apollo # Generate React hooks
    config:
      withHooks: true # Generate useQuery/useMutation hooks
      withHOC: false # Don't generate HOCs (old pattern)
      withComponent: false # Don't generate components (old pattern)
      skipTypename: false # Include __typename in queries
      avoidOptionals: false # Use optional (?) for nullable fields
      useTypeImports: true # Use `import type` for better tree-shaking
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to GraphQL endpoint"

**Solution:** Make sure your backend is running at `http://localhost:3000/graphql`

```bash
# In your backend project
npm run start:dev
```

### Error: "Module not found: Can't resolve '@/graphql/generated/graphql'"

**Solution:** Run code generation first:

```bash
npm run codegen
```

### Generated hooks are outdated

**Solution:** Re-run code generation:

```bash
npm run codegen
```

### Subscription not receiving updates

**Solution:** Check your Apollo Client WebSocket configuration in `src/lib/apollo-client.ts`:

```typescript
// Make sure NEXT_PUBLIC_GRAPHQL_WS_URL is set
console.log(process.env.NEXT_PUBLIC_GRAPHQL_WS_URL); // Should be ws://localhost:3000/graphql
```

### TypeScript errors after regenerating

**Solution:** Restart your TypeScript server in VS Code:

1. Press `Ctrl+Shift+P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

---

## 📚 Advanced Usage

### Custom Fetch Policies

```tsx
const { data } = useGetAllProductsQuery({
  fetchPolicy: "network-only", // Always fetch from server
  // or 'cache-first' (default) - use cache if available
  // or 'cache-and-network' - use cache then update from network
  // or 'no-cache' - always fetch, don't cache
});
```

### Refetching Data

```tsx
const { data, refetch } = useGetAllCustomersQuery();

// Later...
const handleRefresh = () => {
  refetch(); // Fetch fresh data
};
```

### Lazy Queries (Fetch on Demand)

```tsx
import { useGetCustomerByIdLazyQuery } from "@/graphql/generated/graphql";

const [getCustomer, { data, loading }] = useGetCustomerByIdLazyQuery();

const handleClick = () => {
  getCustomer({ variables: { id: "123" } });
};
```

### Optimistic Updates

```tsx
const [deleteCustomer] = useDeleteCustomerMutation({
  optimisticResponse: {
    deleteCustomer: true,
  },
  update: (cache, { data }) => {
    // Update cache immediately before server responds
    cache.modify({
      fields: {
        customers(existingCustomers, { readField }) {
          return existingCustomers.filter(
            (ref: any) => readField("id", ref) !== deletedId
          );
        },
      },
    });
  },
});
```

### Error Handling

```tsx
const { data, error } = useGetAllUsersQuery({
  onError: (error) => {
    console.error("GraphQL Error:", error);
    // Show toast notification
    // Log to error tracking service
  },
});
```

---

## 🚀 Next Steps

1. **Run code generation:**

   ```bash
   npm run codegen
   ```

2. **Start using generated hooks** in your components

3. **Keep codegen running in watch mode** during development:

   ```bash
   npm run codegen:watch
   ```

4. **Check out the example components** above to see how to use queries, mutations, and subscriptions

5. **Read the GraphQL files** in `src/graphql/` to understand available operations

---

## 📖 Additional Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator Documentation](https://the-guild.dev/graphql/codegen)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

---

**Happy Coding! 🎉**
