# TODO: Change Product to Inventory

- [ ] Update src/graphql/mutations/products.graphql to use inventory mutations (CreateInventory, UpdateInventory, DeleteInventory)
- [ ] Update src/graphql/queries/products.graphql to use inventory queries (GetMyInventory, GetInventoryItem)
- [ ] Update src/app/actions/product.ts: Change deleteProduct to use DeleteInventory, update any product queries to inventory
- [ ] Update src/components/forms/ProductForm.tsx: Change schema and fields to match inventory (description, quantity, unit_price, sku, images)
- [ ] Rename src/app/dashboard/products/ directory to src/app/dashboard/inventory/
- [ ] Update any references in other files (e.g., sidebar, links) to point to /inventory/ instead of /products/
- [ ] Regenerate GraphQL types after changes
- [ ] Test the inventory pages and forms
- [ ] Update any hardcoded links or routes
