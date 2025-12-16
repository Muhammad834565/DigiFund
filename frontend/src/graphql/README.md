# GraphQL Operations

This folder contains all GraphQL queries, mutations, and subscriptions for the application.

## 📂 Structure

```
graphql/
├── queries/           # GraphQL queries (fetching data)
├── mutations/         # GraphQL mutations (modifying data)
├── subscriptions/     # GraphQL subscriptions (real-time updates)
└── generated/         # Auto-generated TypeScript code (don't edit!)
```

## 🚀 Getting Started

1. Make sure your backend is running at `http://localhost:3000/graphql`
2. Run code generation: `npm run codegen`
3. Import and use generated hooks in your components

## 📖 Documentation

- **QUICK_START.md** - Quick reference guide
- **GRAPHQL_SETUP.md** - Complete setup and usage documentation
- **GRAPHQL_TESTING.md** - Test queries for GraphQL Playground

## 🔄 Workflow

1. Add/edit `.graphql` files in this folder
2. Run `npm run codegen` to generate TypeScript hooks
3. Import hooks from `@/graphql/generated/graphql`
4. Use in your React components

## Example

```tsx
// Import generated hook
import { useGetAllCustomersQuery } from "@/graphql/generated/graphql";

// Use in component
function CustomerList() {
  const { data, loading } = useGetAllCustomersQuery();

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.customers.map((customer) => (
        <li key={customer.id}>{customer.name}</li>
      ))}
    </ul>
  );
}
```

For detailed examples, see `GRAPHQL_SETUP.md`.
