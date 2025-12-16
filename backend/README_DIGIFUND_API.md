# DigiFund E-Commerce Backend

A comprehensive NestJS backend API with GraphQL for managing invoices, inventory, suppliers, consumers, and financial data for e-commerce businesses.

## 🚀 Features

### Authentication & Authorization

- ✅ User signup with OTP verification (3-minute expiry)
- ✅ Login with email or phone number
- ✅ Password reset with OTP
- ✅ JWT token-based authentication
- ✅ Cookie-based session management
- ✅ Role-based access control
- ✅ Automatic unique ID generation (public_id and private_id)

### User Management

- ✅ Multiple user roles: Guest User, Supplier, Consumer, Inventory Manager, Financial Manager, Student, Business Owner
- ✅ Profile management
- ✅ Activity logging

### Invoice Management

- ✅ Create, read, update, delete invoices
- ✅ Automatic invoice numbering (10+ digits)
- ✅ Dual storage (bill_from and bill_to)
- ✅ Invoice status management (pending, approved, declined, clear)
- ✅ Email notifications for all parties
- ✅ User-specific invoice access control
- ✅ Multiple invoice items support

### Inventory Management

- ✅ Full CRUD operations
- ✅ SKU management
- ✅ Multiple image support
- ✅ Price and quantity tracking
- ✅ User-specific inventory

### Supplier/Consumer Management

- ✅ Relationship request system (send & accept)
- ✅ Search users by public_id, email, or phone
- ✅ Manage supplier and consumer relationships
- ✅ Relationship status tracking

### Financial Dashboard

- ✅ Total income/expense tracking
- ✅ Balance calculation
- ✅ Transaction history
- ✅ Charts and analytics (monthly, weekly, daily)
- ✅ Category-wise sales summaries

### Business Dashboard

- ✅ Total suppliers count
- ✅ Total inventory count
- ✅ Total sales
- ✅ Pending orders count
- ✅ 10 recent activities

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
cd h:\project\nextgenesollearning\project\digifund\ecomerce\backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install additional required packages

```bash
npm install nodemailer
npm install @types/nodemailer --save-dev
```

### 4. Setup PostgreSQL Database

#### Create Database

```sql
CREATE DATABASE digifund_ecommerce;
```

#### Run Schema

```bash
psql -U postgres -d digifund_ecommerce -f database-schema.sql
```

Or connect to PostgreSQL and run the SQL file:

```sql
\c digifund_ecommerce
\i database-schema.sql
```

### 5. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=digifund_ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM="DigiFund <noreply@digifund.com>"

# Application Configuration
NODE_ENV=development
PORT=3000

# Gemini AI (if using AI features)
GEMINI_API_KEY=your_gemini_api_key
```

### 6. Email Setup

#### For Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App-Specific Password:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

#### For Development (Ethereal):

```typescript
// Alternatively, use Ethereal for testing (no real emails sent)
// Visit https://ethereal.email/ to create a test account
EMAIL_HOST = smtp.ethereal.email;
EMAIL_PORT = 587;
EMAIL_USER = your - ethereal - username;
EMAIL_PASSWORD = your - ethereal - password;
```

## 🚀 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📡 API Endpoints

### GraphQL Playground

Access the GraphQL Playground at: `http://localhost:3000/graphql`

### Authentication Endpoints

#### 1. Signup

```graphql
mutation Signup {
  signup(
    input: {
      contact_person: "John Doe"
      email: "john@example.com"
      phone_no: "+1234567890"
      password: "SecurePass123"
      role: "business_owner"
      company_name: "ACME Corp"
      address: "123 Main St, City, Country"
      gender: "male"
      type_of_business: "Technology"
    }
  ) {
    message
    email
  }
}
```

#### 2. Verify OTP

```graphql
mutation VerifyOtp {
  verifyOtp(
    input: { email: "john@example.com", otp: "123456", purpose: "signup" }
  ) {
    success
    message
  }
}
```

#### 3. Login

```graphql
mutation Login {
  login(input: { email: "john@example.com", password: "SecurePass123" }) {
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

#### 4. Forgot Password

```graphql
mutation ForgotPassword {
  forgotPassword(input: { email: "john@example.com" }) {
    success
    message
  }
}
```

#### 5. Reset Password

```graphql
mutation ResetPassword {
  resetPassword(
    input: {
      email: "john@example.com"
      otp: "123456"
      new_password: "NewSecurePass123"
    }
  ) {
    success
    message
  }
}
```

#### 6. Logout

```graphql
mutation Logout {
  logout {
    success
    message
  }
}
```

#### 7. Get Current User

```graphql
query Me {
  me {
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
  }
}
```

### Invoice Endpoints (See GRAPHQL_ENDPOINTS.md for complete examples)

## 🔑 User Roles & Public ID Prefixes

| Role              | Prefix | Example  |
| ----------------- | ------ | -------- |
| Guest User        | gus    | gus-001  |
| Supplier          | sup    | sup-002  |
| Consumer          | cos    | cos-003  |
| Inventory Manager | inv    | inv-004  |
| Financial Manager | fin    | fin-005  |
| Student           | stu    | stu-006  |
| Business Owner    | digi   | digi-007 |

**Note:** The sequential number is unique across all roles (e.g., gus-001, then sup-002, not sup-001).

## 🔒 Security Features

1. **Password Hashing:** All passwords are hashed using bcrypt (10 rounds)
2. **OTP Security:**
   - 3-minute expiry
   - Maximum 5 attempts per OTP
   - Maximum 5 OTPs per day per email
   - Automatic cleanup of expired OTPs

3. **JWT Tokens:**
   - 7-day expiry
   - Stored in database for server-side validation
   - Can be invalidated on logout

4. **Access Control:**
   - Route-level authentication guards
   - User can only access their own data
   - Invoices accessible only to bill_from and bill_to users

## 📊 Database Schema

### Main Tables

- `user_main` - User accounts
- `login_tokens` - Active JWT tokens
- `digi_otp` - OTP records
- `invoices_master` - All invoices
- `invoice_items` - Invoice line items
- `inventory_master` - Inventory items
- `supplier_relationships` - Supplier connections
- `consumer_relationships` - Consumer connections
- `relationship_requests` - Pending relationship requests
- `activity_log` - User activity tracking

### Sequences

- `invoice_number_seq` - Auto-incrementing invoice numbers

## 🧪 Testing the API

### 1. Using GraphQL Playground

Navigate to `http://localhost:3000/graphql` and use the built-in interface.

### 2. Set Authentication Header

After login, add the token to HTTP headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

### 3. Sample Workflow

1. **Signup** → Receive OTP email
2. **Verify OTP** → Account activated
3. **Login** → Receive JWT token
4. **Create Invoice** → Generate invoice
5. **View Invoices** → See all your invoices
6. **Update Invoice Status** → Approve/decline
7. **View Dashboard** → See analytics

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.service.ts      # Auth business logic
│   ├── auth.resolver.ts     # GraphQL resolvers
│   ├── auth.module.ts       # Module definition
│   ├── jwt.strategy.ts      # JWT strategy
│   ├── jwt-auth.guard.ts    # Auth guard
│   └── dto/                 # Data transfer objects
├── common/
│   ├── dto/                 # Shared DTOs
│   ├── services/            # Shared services
│   │   ├── email.service.ts # Email functionality
│   │   └── otp.service.ts   # OTP management
│   └── utils/               # Utility functions
│       └── id-generator.util.ts # ID generation
├── entities/                # TypeORM entities
│   ├── user-main.entity.ts
│   ├── login-token.entity.ts
│   ├── digi-otp.entity.ts
│   ├── invoice-master.entity.ts
│   ├── inventory-master.entity.ts
│   ├── relationship.entity.ts
│   └── activity-log.entity.ts
├── invoices/                # Invoice module (to be updated)
├── inventory/               # Inventory module (to be created)
├── suppliers/               # Supplier module (to be created)
├── consumers/               # Consumer module (to be created)
├── finance/                 # Finance module (to be created)
├── dashboard/               # Dashboard module (to be updated)
└── app.module.ts            # Root module
```

## 🔧 Common Issues & Solutions

### Issue: Database connection error

**Solution:** Check your PostgreSQL service is running and credentials in `.env` are correct.

```bash
# Windows
net start postgresql-x64-14

# Linux/Mac
sudo service postgresql start
```

### Issue: Email not sending

**Solution:**

1. Check email credentials
2. For Gmail, use App-Specific Password
3. For development, use Ethereal Email (test account)

### Issue: OTP expired

**Solution:** OTPs expire after 3 minutes. Request a new OTP.

### Issue: Cannot find module errors

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables Reference

| Variable       | Description            | Example                  |
| -------------- | ---------------------- | ------------------------ |
| DB_HOST        | PostgreSQL host        | localhost                |
| DB_PORT        | PostgreSQL port        | 5432                     |
| DB_USERNAME    | Database username      | postgres                 |
| DB_PASSWORD    | Database password      | yourpassword             |
| DB_DATABASE    | Database name          | digifund_ecommerce       |
| JWT_SECRET     | Secret key for JWT     | random-secret-key        |
| JWT_EXPIRES_IN | Token expiration       | 7d                       |
| EMAIL_HOST     | SMTP server host       | smtp.gmail.com           |
| EMAIL_PORT     | SMTP server port       | 587                      |
| EMAIL_USER     | Email account username | your-email@gmail.com     |
| EMAIL_PASSWORD | Email account password | app-specific-password    |
| EMAIL_FROM     | Sender email display   | "DigiFund <noreply@...>" |
| PORT           | Application port       | 3000                     |
| NODE_ENV       | Environment            | development/production   |

## 📞 Support

For issues or questions:

- Check existing documentation
- Review GraphQL schema at `/graphql`
- Check application logs
- Contact development team

## 📄 License

Proprietary - All rights reserved

## 👥 Contributors

- Development Team - DigiFund

---

**Note:** This is a development version. For production deployment:

1. Change all secret keys
2. Enable HTTPS
3. Set `synchronize: false` in TypeORM config
4. Use migrations for database changes
5. Enable rate limiting
6. Add input validation middleware
7. Configure CORS properly
8. Set up logging and monitoring
9. Use environment-specific configurations
10. Enable database backups
