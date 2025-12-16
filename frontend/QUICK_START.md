# Quick Start Guide - GraphQL Code Generation

## ⚡ Quick Commands

```bash
# Generate TypeScript types and hooks (run this first!)
npm run codegen

# Auto-regenerate on file changes (during development)
npm run codegen:watch

# Start development server
npm run dev
```

---

## 📂 File Organization

**Write your GraphQL here:**

- `src/graphql/queries/*.graphql` - All queries (fetching data)
- `src/graphql/mutations/*.graphql` - All mutations (changing data)
- `src/graphql/subscriptions/*.graphql` - All subscriptions (real-time)

**Import generated hooks from here:**

- `src/graphql/generated/graphql.ts` - Auto-generated (don't edit!)

---

## 🚀 Usage in 3 Steps

### 1. Make sure backend is running

```bash
# Your GraphQL server should be at http://localhost:3000/graphql
```

### 2. Generate hooks

```bash
npm run codegen
```

### 3. Use in your component

```tsx
import { useGetAllUsersQuery } from "@/graphql/generated/graphql";

const { data, loading } = useGetAllUsersQuery();
```

---

## 📖 Pattern Examples

### Query (Fetch Data)

```tsx
const { data, loading, error } = useGetAllCustomersQuery();
```

### Mutation (Change Data)

```tsx
const [createCustomer] = useCreateCustomerMutation();

await createCustomer({
  variables: {
    input: { name: "John", email: "john@example.com" },
  },
});
```

### Subscription (Real-time)

```tsx
const { data } = useMessageReceivedSubscription({
  variables: { roomId: "123" },
});
```

---

## 📁 What Each Folder Contains

### `queries/` - Fetching Data

- `users.graphql` - User queries
- `customers.graphql` - Customer queries
- `products.graphql` - Product queries
- `invoices.graphql` - Invoice queries
- `chat.graphql` - Chat queries
- `dashboard.graphql` - Dashboard stats

### `mutations/` - Changing Data

- `auth.graphql` - Login, signup, logout
- `customers.graphql` - Create, update, delete customers
- `products.graphql` - Create, update, delete products
- `invoices.graphql` - Create, update, delete invoices
- `chat.graphql` - Create rooms, send messages

### `subscriptions/` - Real-time Updates

- `dashboard.graphql` - Live dashboard stats
- `chat.graphql` - Live chat messages

---

## 🔧 When to Run Codegen

Run `npm run codegen` when:

- ✅ First time setting up the project
- ✅ You add/edit any `.graphql` file
- ✅ Backend GraphQL schema changes
- ✅ You get TypeScript errors about missing types

---

## 📚 Full Documentation

- **Setup Guide**: `GRAPHQL_SETUP.md` - Complete documentation
- **Testing Guide**: `GRAPHQL_TESTING.md` - Test queries in GraphQL Playground
- **This File**: `QUICK_START.md` - Quick reference

---

**Need help? Check GRAPHQL_SETUP.md for detailed examples!**
