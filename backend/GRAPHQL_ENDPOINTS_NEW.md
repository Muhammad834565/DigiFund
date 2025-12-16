# DigiFund GraphQL API - Complete Endpoints

## Authentication Endpoints

### 1. Signup

```graphql
mutation Signup {
  signup(
    input: {
      contact_person: "John Doe"
      email: "john@example.com"
      phone_no: "+1234567890"
      password: "SecurePass123!"
      role: "business_owner"
      company_name: "ACME Corporation"
      address: "123 Main St, New York, NY 10001"
      gender: "male"
      type_of_business: "Technology"
    }
  ) {
    message
    email
  }
}
```

### 2. Verify OTP (Signup)

```graphql
mutation VerifySignupOtp {
  verifyOtp(
    input: { email: "john@example.com", otp: "123456", purpose: "signup" }
  ) {
    success
    message
  }
}
```

### 3. Login (with Email)

```graphql
mutation LoginWithEmail {
  login(input: { email: "john@example.com", password: "SecurePass123!" }) {
    token
    company_name
    public_id
    private_id
    contact_person
    email
    phone_no
    address
    status
    gender
    type_of_business
    role
  }
}
```

### 4. Login (with Phone)

```graphql
mutation LoginWithPhone {
  login(input: { phone_no: "+1234567890", password: "SecurePass123!" }) {
    token
    company_name
    public_id
    private_id
    contact_person
    email
    phone_no
    role
  }
}
```

### 5. Forgot Password

```graphql
mutation ForgotPassword {
  forgotPassword(input: { email: "john@example.com" }) {
    success
    message
  }
}
```

### 6. Reset Password

```graphql
mutation ResetPassword {
  resetPassword(
    input: {
      email: "john@example.com"
      otp: "654321"
      new_password: "NewSecurePass456!"
    }
  ) {
    success
    message
  }
}
```

### 7. Logout

**Headers Required:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

```graphql
mutation Logout {
  logout {
    success
    message
  }
}
```

### 8. Get Current User Profile

**Headers Required:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

```graphql
query GetMyProfile {
  me {
    id
    public_id
    private_id
    company_name
    contact_person
    email
    phone_no
    address
    status
    gender
    type_of_business
    role
    is_verified
    created_at
    updated_at
  }
}
```

### 9. Update Profile

**Headers Required:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

```graphql
mutation UpdateMyProfile {
  updateProfile(
    input: {
      company_name: "ACME Corporation Updated"
      contact_person: "John M. Doe"
      phone_no: "+1234567891"
      address: "456 New St, Boston, MA 02101"
      type_of_business: "Technology & Innovation"
    }
  ) {
    id
    company_name
    contact_person
    phone_no
    address
    updated_at
  }
}
```

### 10. Get User by Public ID

**Headers Required:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

```graphql
query GetUserByPublicId {
  getUserByPublicId(public_id: "digi-001") {
    public_id
    company_name
    contact_person
    email
    phone_no
    role
  }
}
```

---

## Invoice Endpoints

### Headers Required for All Invoice Endpoints:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### 1. Create Invoice

**Important:** Invoice type is automatically set:

- Creator (you) → `invoice_type = "income"` (expecting payment)
- Receiver → sees as `"expense"` (owes payment)

```graphql
mutation CreateInvoice {
  createInvoice(
    input: {
      # Provide ONE of these three options:
      bill_to_public_id: "sup-001"
      # OR bill_to_email: "customer@example.com"
      # OR bill_to_phone: "+1234567890"

      items: [
        {
          inventory_id: "INV-001"
          qty: 10
          rate: 100.00
          discount_percentage: 5 # Optional
        }
        { inventory_id: "INV-002", qty: 1, rate: 500.00 }
      ]
      notes: "Payment due in 30 days" # Optional
    }
  ) {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_to_public_id
    bill_from_status
    bill_to_status
    invoice_date
    total_amount
    items {
      id
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
    created_at
  }
}
```

### 2. Get All My Invoices

```graphql
query GetMyInvoices {
  getInvoices {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_to_public_id
    bill_from_status
    bill_to_status
    invoice_date
    total_amount
    bill_from_name
    bill_to_name
    created_at
    items {
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
  }
}
```

### 3. Get Invoice by Number

```graphql
query GetInvoice {
  getInvoiceByNumber(invoice_number: "INV-1702461234567") {
    id
    invoice_number
    invoice_type
    status
    bill_from_public_id
    bill_to_public_id
    bill_from_status
    bill_to_status
    invoice_date
    total_amount
    bill_from_name
    bill_from_email
    bill_from_phone
    bill_from_address
    bill_to_name
    bill_to_email
    bill_to_phone
    bill_to_address
    items {
      id
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
    created_at
    updated_at
  }
}
```

### 4. Update Invoice Status

**Note:** Status updates are role-based:

- If you're `bill_from`, updates `bill_from_status`
- If you're `bill_to`, updates `bill_to_status`
- Overall `status` changes when both parties approve

```graphql
mutation UpdateInvoiceStatus {
  updateInvoiceStatus(
    input: {
      invoice_number: "INV-1702461234567"
      status: "approved" # Options: pending, approved, declined, clear
    }
  ) {
    id
    invoice_number
    status
    bill_from_status
    bill_to_status
    updated_at
  }
}
```

### 5. Update Invoice Items

**Note:** You can update items and notes for invoices. Total amount is automatically recalculated.

```graphql
mutation UpdateInvoice {
  updateInvoice(
    invoice_number: "INV-1702461234567"
    input: {
      items: [
        {
          inventory_id: "INV-001"
          qty: 15
          rate: 120.00
          discount_percentage: 10
        }
        { inventory_id: "INV-002", qty: 5, rate: 200.00 }
      ]
      notes: "Updated invoice with new quantities"
    }
  ) {
    id
    invoice_number
    invoice_type
    status
    total_amount
    items {
      id
      inventory_id
      qty
      rate
      discount_percentage
      total_price
    }
    updated_at
  }
}
```

### 6. Delete Invoice

**Important:** Can only delete invoices that are NOT approved. Once approved, invoices cannot be deleted.

```graphql
mutation DeleteInvoice {
  deleteInvoice(invoice_number: "INV-1702461234567") {
    id
    invoice_number
    invoice_type
    status
    total_amount
    created_at
  }
}
```

**REST API Alternative:**

```
DELETE /invoices/INV-1702461234567
Authorization: Bearer YOUR_JWT_TOKEN
```

**Restrictions:**

- ❌ Cannot delete if `status = "approved"`
- ❌ Cannot delete if `bill_from_status = "approved"`
- ❌ Cannot delete if `bill_to_status = "approved"`
- ✅ Only creator (bill_from) or recipient (bill_to) can delete
- ✅ Requires authentication

---

## Inventory Endpoints (To be implemented)

### Headers Required:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### 1. Create Inventory Item

```graphql
mutation CreateInventory {
  createInventory(
    input: {
      description: "Premium Wireless Mouse"
      price: 49.99
      quantity: 100
      unit_price: 49.99
      sku: "MOUSE-PRO-001"
      images: [
        "https://example.com/images/mouse1.jpg"
        "https://example.com/images/mouse2.jpg"
      ]
    }
  ) {
    id
    inventory_id
    description
    price
    quantity
    sku
    images
    created_at
  }
}
```

### 2. Get All My Inventory

```graphql
query GetMyInventory {
  getInventory {
    id
    inventory_id
    description
    price
    quantity
    unit_price
    sku
    images
    created_at
    updated_at
  }
}
```

### 3. Get Inventory by ID

```graphql
query GetInventoryItem {
  getInventoryById(inventory_id: "INV-1702461234-0001") {
    id
    inventory_id
    description
    price
    quantity
    unit_price
    sku
    images
  }
}
```

### 4. Update Inventory

```graphql
mutation UpdateInventory {
  updateInventory(
    inventory_id: "INV-1702461234-0001"
    input: {
      description: "Premium Wireless Mouse - Updated"
      price: 54.99
      quantity: 150
      unit_price: 54.99
    }
  ) {
    inventory_id
    description
    price
    quantity
    updated_at
  }
}
```

### 5. Delete Inventory

```graphql
mutation DeleteInventory {
  deleteInventory(inventory_id: "INV-1702461234-0001") {
    message
  }
}
```

---

## Supplier/Consumer Endpoints (To be implemented)

### Headers Required:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### 1. Send Relationship Request

```graphql
mutation SendSupplierRequest {
  sendRelationshipRequest(
    input: { requested_public_id: "sup-003", relationship_type: "supplier" }
  ) {
    id
    requester_public_id
    requested_public_id
    relationship_type
    status
    created_at
  }
}
```

### 2. Accept/Reject Relationship Request

```graphql
mutation AcceptRequest {
  acceptRejectRequest(input: { request_id: "1", action: "accepted" }) {
    id
    status
    updated_at
  }
}
```

### 3. Get My Relationship Requests

```graphql
query GetMyRequests {
  getMyRelationshipRequests {
    id
    requester_public_id
    requested_public_id
    relationship_type
    status
    created_at
  }
}
```

### 4. Add Supplier

```graphql
mutation AddSupplier {
  addSupplier(
    input: {
      supplier_public_id: "sup-003"
      # OR search and add
      # email: "supplier@example.com"
    }
  ) {
    id
    supplier_public_id
    company_name
    contact_person
    email
    phone_no
    location
    status
  }
}
```

### 5. Get My Suppliers

```graphql
query GetMySuppliers {
  getSuppliers {
    id
    supplier_public_id
    company_name
    contact_person
    email
    phone_no
    location
    status
    created_at
  }
}
```

### 6. Update Supplier

```graphql
mutation UpdateSupplier {
  updateSupplier(
    supplier_id: 1
    input: {
      company_name: "Updated Supplier Inc"
      contact_person: "Jane Smith"
      phone_no: "+1234567890"
      location: "New York, USA"
      status: "active"
    }
  ) {
    id
    company_name
    contact_person
    updated_at
  }
}
```

### 7. Delete Supplier

```graphql
mutation DeleteSupplier {
  deleteSupplier(supplier_id: 1) {
    message
  }
}
```

### 8. Search User (for adding relationship)

```graphql
query SearchUser {
  searchUser(
    input: {
      email: "user@example.com"
      # OR
      # phone_no: "+1234567890"
      # OR
      # public_id: "sup-003"
    }
  ) {
    public_id
    company_name
    contact_person
    email
    phone_no
    role
  }
}
```

---

## Finance Dashboard (To be implemented)

### Headers Required:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Get Financial Dashboard

```graphql
query GetFinanceDashboard {
  getFinanceDashboard {
    total_income
    total_expense
    balance
    transactions {
      date
      invoice_number
      description
      category
      amount
      type
    }
    charts {
      sales_by_item {
        item_name
        total_amount
      }
      monthly_sales {
        month
        total_amount
      }
      weekly_sales {
        day
        total_amount
      }
      monthly_sales_count {
        month
        count
      }
    }
  }
}
```

---

## Business Dashboard (To be implemented)

### Headers Required:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Get Business Dashboard

```graphql
query GetBusinessDashboard {
  getBusinessDashboard {
    total_suppliers
    total_inventory
    total_sales
    total_pending_orders
    recent_activities {
      id
      activity_type
      description
      created_at
      metadata
    }
  }
}
```

---

## Common Error Responses

### Authentication Error

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Validation Error

```json
{
  "errors": [
    {
      "message": "Bad Request Exception",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "validationErrors": [
          "email must be an email",
          "password must be longer than or equal to 8 characters"
        ]
      }
    }
  ]
}
```

### Not Found Error

```json
{
  "errors": [
    {
      "message": "Invoice not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### Forbidden Error

```json
{
  "errors": [
    {
      "message": "You do not have access to this resource",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

---

## Testing Workflow

1. **Signup** → Get OTP in email
2. **Verify OTP** → Account activated
3. **Login** → Receive JWT token
4. **Copy JWT token** → Add to Authorization header
5. **Create Invoice** → Invoice created and emails sent
6. **Get Invoices** → View all invoices
7. **Update Status** → Approve/decline invoice
8. **Add Inventory** → Manage products
9. **Add Suppliers** → Build relationships
10. **View Dashboards** → Analyze business data

---

## Notes

1. All mutations/queries requiring authentication need the `Authorization` header with JWT token
2. Cookies are automatically set on login (token, public_id, private_id)
3. OTP expires after 3 minutes
4. **Invoice numbers are auto-generated** (format: `INV-{timestamp}`)
5. **Invoice type is automatic**: Creator sees "income", receiver sees "expense"
6. **Invoice date is auto-set** to current timestamp (TIMESTAMP type, not just DATE)
7. **Invoice items reference inventory** using `inventory_id`
8. **Total amounts are auto-calculated** from qty × rate - discount
9. **Invoice deletion restrictions**: Only pending invoices can be deleted (not approved ones)
10. Public IDs are role-based and sequential (gus-001, sup-002, cos-003, etc.)
11. Private IDs are 15-character random alphanumeric starting with a letter
12. **Dual storage**: Invoices are saved in both bill_from and bill_to user accounts
13. **Status updates are role-based**: bill_from updates bill_from_status, bill_to updates bill_to_status
14. JWT tokens include: `id`, `public_id`, `private_id`, `email`, and `role`

---

## GraphQL Schema Introspection

To see the complete schema, use:

```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

Or view the Documentation Explorer in GraphQL Playground at: `http://localhost:3000/graphql`
