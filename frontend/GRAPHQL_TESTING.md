# GraphQL Testing Guide

This file contains all the GraphQL operations ready to test in your GraphQL Playground or Apollo Studio.

**Backend URL:** http://localhost:3000/graphql

---

## 1. USER MANAGEMENT

### Get All Users (to get their IDs)

```graphql
query GetAllUsers {
  users {
    id
    name
    email
    role
  }
}
```

### Get User By ID

```graphql
query GetUserById {
  user(id: "f6fa4321-bb5b-493a-b1da-24a4f5fc25a4") {
    id
    name
    email
    role
  }
}
```

---

## 2. DASHBOARD - Real-time Statistics

### Query Current Dashboard Stats

```graphql
query GetDashboardStats {
  dashboardStats {
    id
    totalCustomers
    totalProducts
    totalInvoices
    totalRevenue
    activeUsers
    pendingInvoices
    timestamp
  }
}
```

### Subscribe to Real-time Dashboard Updates

**Open this in a SEPARATE TAB and leave it running**

```graphql
subscription DashboardLiveStats {
  dashboardStatsUpdated {
    id
    totalCustomers
    totalProducts
    totalInvoices
    totalRevenue
    activeUsers
    pendingInvoices
    timestamp
  }
}
```

---

## 3. CHAT SYSTEM - Step by Step

### Step 1: Create a Group Chat Room

```graphql
mutation CreateGroupRoom {
  createChatRoom(
    input: {
      name: "General Discussion"
      participantIds: [
        "f6fa4321-bb5b-493a-b1da-24a4f5fc25a4"
        "f790e581-d83f-405f-9b86-59e43a0ceffa"
      ]
    }
  ) {
    id
    name
    participantIds
    createdAt
    updatedAt
  }
}
```

### Step 2: Subscribe to Room Messages (Real-time)

**Open this in a SEPARATE TAB and leave it running**

```graphql
subscription RoomMessages {
  messageReceived(roomId: "a3857848-9ab0-4c33-8e3f-46a3d701daf7") {
    id
    roomId
    senderId
    receiverId
    message
    createdAt
  }
}
```

### Step 3: Send Messages to the Room

**Open this in ANOTHER TAB**

```graphql
mutation SendMessage1 {
  sendChatMessage(
    input: {
      roomId: "a3857848-9ab0-4c33-8e3f-46a3d701daf7"
      senderId: "f6fa4321-bb5b-493a-b1da-24a4f5fc25a4"
      message: "Hello everyone! This is John."
    }
  ) {
    id
    roomId
    senderId
    message
    createdAt
  }
}
```

```graphql
mutation SendMessage2 {
  sendChatMessage(
    input: {
      roomId: "a3857848-9ab0-4c33-8e3f-46a3d701daf7"
      senderId: "f790e581-d83f-405f-9b86-59e43a0ceffa"
      message: "Hi John! This is Jane."
    }
  ) {
    id
    roomId
    senderId
    message
    createdAt
  }
}
```

### Step 4: Get All Messages in a Room (Query)

```graphql
query GetRoomMessages {
  chatRoomMessages(roomId: "a3857848-9ab0-4c33-8e3f-46a3d701daf7") {
    id
    senderId
    receiverId
    message
    createdAt
  }
}
```

### Step 5: Get User's Chat Rooms

```graphql
query GetUserRooms {
  userChatRooms(userId: "f6fa4321-bb5b-493a-b1da-24a4f5fc25a4") {
    id
    name
    participantIds
    createdAt
  }
}
```

---

## 4. CUSTOMER MANAGEMENT

### Create Customer

```graphql
mutation CreateCustomer {
  createCustomer(
    input: {
      name: "Acme Corporation"
      email: "contact@acme.com"
      phone: "+1-555-0100"
      address: "123 Business St, Tech City, TC 12345"
    }
  ) {
    id
    name
    email
    phone
    address
    createdAt
  }
}
```

### Get All Customers

```graphql
query GetAllCustomers {
  customers {
    id
    name
    email
    phone
    address
    createdAt
  }
}
```

### Update Customer

```graphql
mutation UpdateCustomer {
  updateCustomer(
    id: "REPLACE_WITH_CUSTOMER_ID"
    input: { name: "Acme Corp Updated", email: "updated@acme.com" }
  ) {
    id
    name
    email
    updatedAt
  }
}
```

### Delete Customer

```graphql
mutation DeleteCustomer {
  deleteCustomer(id: "REPLACE_WITH_CUSTOMER_ID")
}
```

---

## 5. PRODUCT MANAGEMENT

### Create Product

```graphql
mutation CreateProduct {
  createProduct(
    input: {
      name: "Premium Widget"
      description: "High-quality widget for all your needs"
      price: 99.99
      stock: 100
    }
  ) {
    id
    name
    description
    price
    stock
    createdAt
  }
}
```

### Get All Products

```graphql
query GetAllProducts {
  products {
    id
    name
    description
    price
    stock
    createdAt
  }
}
```

### Update Product

```graphql
mutation UpdateProduct {
  updateProduct(
    id: "REPLACE_WITH_PRODUCT_ID"
    input: { price: 89.99, stock: 150 }
  ) {
    id
    name
    price
    stock
    updatedAt
  }
}
```

### Delete Product

```graphql
mutation DeleteProduct {
  deleteProduct(id: "REPLACE_WITH_PRODUCT_ID")
}
```

---

## 6. INVOICE MANAGEMENT

### Create Invoice

```graphql
mutation CreateInvoice {
  createInvoice(
    input: {
      customerId: "REPLACE_WITH_CUSTOMER_ID"
      items: [{ productId: "REPLACE_WITH_PRODUCT_ID", qty: 5 }]
    }
  ) {
    id
    customerId
    items {
      productId
      qty
    }
    total
    status
    createdAt
  }
}
```

### Get All Invoices

```graphql
query GetAllInvoices {
  invoices {
    id
    customerId
    total
    status
    createdAt
  }
}
```

### Get Invoice By ID

```graphql
query GetInvoiceById {
  invoice(id: "REPLACE_WITH_INVOICE_ID") {
    id
    customerId
    items {
      productId
      qty
    }
    total
    status
    createdAt
  }
}
```

---

## 7. AUTHENTICATION

### Signup

```graphql
mutation Signup {
  signup(
    name: "Test User"
    email: "testuser@example.com"
    password: "password123"
  ) {
    access_token
    user {
      id
      name
      email
      role
    }
  }
}
```

### Login

```graphql
mutation Login {
  login(email: "testuser@example.com", password: "password123") {
    access_token
    user {
      id
      name
      email
      role
    }
  }
}
```

### Logout

```graphql
mutation Logout {
  logout
}
```

---

## 🧪 Testing Workflow

### Tab Layout for Testing:

1. **Tab 1**: Run `GetAllUsers` to get user IDs
2. **Tab 2**: Run `CreateGroupRoom` to create a chat room (copy the room ID)
3. **Tab 3**: Start subscription `RoomMessages` with the room ID (keep this open)
4. **Tab 4**: Send messages using `SendMessage1`, `SendMessage2`, etc.
5. **Tab 5**: Start subscription `DashboardLiveStats` (keep this open)

### Watch the Magic:

- **Tab 3** will show messages appearing in real-time as you send them in Tab 4
- **Tab 5** will show dashboard stats updating every 3 seconds automatically

---

## ⚠️ Important Notes

1. Replace all `REPLACE_WITH_*_ID` placeholders with actual IDs from your queries
2. Make sure your backend server is running at `http://localhost:3000`
3. Keep subscription tabs open to see real-time updates
4. Copy IDs exactly - don't type them manually to avoid errors

---

**Happy Testing! 🎉**
