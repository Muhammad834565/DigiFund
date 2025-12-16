# DigiFund E-Commerce Backend - Complete Setup Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Email Configuration](#email-configuration)
6. [Running the Application](#running-the-application)
7. [Testing the API](#testing-the-api)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Check Installations

```powershell
node --version    # Should be v18 or higher
npm --version     # Should be 9 or higher
psql --version    # Should be 14 or higher
git --version
```

---

## Installation Steps

### Step 1: Navigate to Project Directory

```powershell
cd h:\project\nextgenesollearning\project\digifund\ecomerce\backend
```

### Step 2: Install Dependencies

```powershell
npm install
```

### Step 3: Install Additional Required Packages

```powershell
npm install nodemailer
npm install @types/nodemailer --save-dev
```

---

## Database Setup

### Option 1: Using PostgreSQL GUI (pgAdmin)

1. **Open pgAdmin**
2. **Create Database:**
   - Right-click on "Databases" → "Create" → "Database"
   - Name: `digifund_ecommerce`
   - Owner: `postgres`
   - Click "Save"

3. **Run Schema:**
   - Right-click on `digifund_ecommerce` → "Query Tool"
   - Open file: `database-schema.sql`
   - Click "Execute" (F5)

### Option 2: Using Command Line (PowerShell)

```powershell
# Start PostgreSQL service (if not running)
net start postgresql-x64-14

# Connect to PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE digifund_ecommerce;
\c digifund_ecommerce
\i 'h:/project/nextgenesollearning/project/digifund/ecomerce/backend/database-schema.sql'
\q
```

### Option 3: Using Single Command

```powershell
psql -U postgres -c "CREATE DATABASE digifund_ecommerce;"
psql -U postgres -d digifund_ecommerce -f database-schema.sql
```

### Verify Database Setup

```powershell
psql -U postgres -d digifund_ecommerce -c "\dt"
```

You should see tables like:

- user_main
- login_tokens
- digi_otp
- invoices_master
- invoice_items
- inventory_master
- supplier_relationships
- consumer_relationships
- relationship_requests
- activity_log

---

## Environment Configuration

### Step 1: Create .env File

```powershell
# Copy the example file
Copy-Item .env.example .env
```

### Step 2: Edit .env File

Open `.env` in your editor and update the following:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
DB_DATABASE=digifund_ecommerce

# JWT Configuration
JWT_SECRET=generate-a-random-secret-key-here-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# Email Configuration (see next section)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM="DigiFund <noreply@digifund.com>"

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Step 3: Generate Secure JWT Secret

```powershell
# Generate random secret (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Copy the output and use it as your `JWT_SECRET`.

---

## Email Configuration

### Option 1: Gmail (Recommended for Production)

#### Setup Steps:

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env:**

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App password from step 2
EMAIL_FROM="DigiFund <noreply@digifund.com>"
```

### Option 2: Ethereal Email (Recommended for Development)

#### Setup Steps:

1. **Create Account:**
   - Visit [https://ethereal.email/](https://ethereal.email/)
   - Click "Create Ethereal Account"
   - Copy the credentials

2. **Update .env:**

```env
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-username@ethereal.email
EMAIL_PASSWORD=your-ethereal-password
EMAIL_FROM="DigiFund <noreply@digifund.com>"
```

**Note:** With Ethereal, emails are not actually sent. You can view them at [https://ethereal.email/messages](https://ethereal.email/messages)

### Option 3: Other SMTP Services

- **SendGrid:** `smtp.sendgrid.net:587`
- **Mailgun:** `smtp.mailgun.org:587`
- **Outlook:** `smtp-mail.outlook.com:587`

---

## Running the Application

### Development Mode (Hot Reload)

```powershell
npm run start:dev
```

You should see:

```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [TypeOrmModule] Database connected successfully
[Nest] INFO [GraphQLModule] GraphQL playground available at http://localhost:3000/graphql
[Nest] INFO [NestApplication] Nest application successfully started
```

### Production Mode

```powershell
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Check if Server is Running

```powershell
# PowerShell
Invoke-WebRequest http://localhost:3000/graphql
```

Or open in browser: [http://localhost:3000/graphql](http://localhost:3000/graphql)

---

## Testing the API

### Step 1: Open GraphQL Playground

Navigate to: [http://localhost:3000/graphql](http://localhost:3000/graphql)

### Step 2: Test Signup Flow

#### 2.1 Signup

```graphql
mutation Signup {
  signup(
    input: {
      contact_person: "Test User"
      email: "test@example.com"
      phone_no: "+1234567890"
      password: "Test123456"
      role: "business_owner"
      company_name: "Test Company"
    }
  ) {
    message
    email
  }
}
```

#### 2.2 Check Email for OTP

- **Gmail:** Check inbox/spam
- **Ethereal:** Visit [https://ethereal.email/messages](https://ethereal.email/messages)

#### 2.3 Verify OTP

```graphql
mutation VerifyOtp {
  verifyOtp(
    input: {
      email: "test@example.com"
      otp: "123456" # Replace with actual OTP from email
      purpose: "signup"
    }
  ) {
    success
    message
  }
}
```

#### 2.4 Login

```graphql
mutation Login {
  login(input: { email: "test@example.com", password: "Test123456" }) {
    token
    public_id
    private_id
    email
    role
  }
}
```

### Step 3: Test Protected Endpoints

#### 3.1 Set Authorization Header

In GraphQL Playground, click "HTTP HEADERS" at the bottom and add:

```json
{
  "Authorization": "Bearer YOUR_TOKEN_FROM_LOGIN"
}
```

#### 3.2 Get Current User

```graphql
query Me {
  me {
    public_id
    private_id
    email
    company_name
    role
  }
}
```

### Step 4: Test Complete Workflow

See [GRAPHQL_ENDPOINTS_NEW.md](GRAPHQL_ENDPOINTS_NEW.md) for complete API documentation.

---

## Troubleshooting

### Issue: Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

```powershell
# Check if PostgreSQL is running
Get-Service postgresql-x64-14

# Start PostgreSQL if stopped
net start postgresql-x64-14

# Verify connection
psql -U postgres -c "SELECT version();"
```

### Issue: Port 3000 Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```powershell
# Find process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill the process (replace PID)
Stop-Process -Id PID -Force

# Or use a different port in .env
PORT=3001
```

### Issue: Email Not Sending

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions:**

1. **For Gmail:**
   - Ensure 2FA is enabled
   - Use App-Specific Password, not your Gmail password
   - Check "Less secure app access" (not recommended)

2. **For Development:**
   - Use Ethereal Email instead
   - Emails won't actually send but you can view them online

### Issue: Module Not Found

```
Error: Cannot find module '@nestjs/typeorm'
```

**Solution:**

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: Database Schema Not Loading

```
Error: relation "user_main" does not exist
```

**Solution:**

```powershell
# Verify database exists
psql -U postgres -l

# Re-run schema
psql -U postgres -d digifund_ecommerce -f database-schema.sql

# Check tables were created
psql -U postgres -d digifund_ecommerce -c "\dt"
```

### Issue: OTP Expired

```
Error: OTP has expired. Please request a new one.
```

**Solution:**

- OTPs expire after 3 minutes
- Request a new OTP by running signup again
- The old OTP will be invalidated automatically

### Issue: TypeORM Sync Issues

```
Error: column "some_column" does not exist
```

**Solution:**

```powershell
# Option 1: Drop and recreate database (DEV ONLY)
psql -U postgres -c "DROP DATABASE digifund_ecommerce;"
psql -U postgres -c "CREATE DATABASE digifund_ecommerce;"
psql -U postgres -d digifund_ecommerce -f database-schema.sql

# Option 2: Set synchronize to true (DEV ONLY)
# In app.module.ts temporarily set: synchronize: true
# This will auto-sync schema with entities
```

---

## Useful Commands

### Database Commands

```powershell
# Connect to database
psql -U postgres -d digifund_ecommerce

# List all tables
psql -U postgres -d digifund_ecommerce -c "\dt"

# View table structure
psql -U postgres -d digifund_ecommerce -c "\d user_main"

# Count users
psql -U postgres -d digifund_ecommerce -c "SELECT COUNT(*) FROM user_main;"

# View recent users
psql -U postgres -d digifund_ecommerce -c "SELECT public_id, email, role FROM user_main ORDER BY created_at DESC LIMIT 5;"

# Clear all data (CAREFUL!)
psql -U postgres -d digifund_ecommerce -f database-schema.sql
```

### Application Commands

```powershell
# Development with watch mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

### Logs and Debugging

```powershell
# View logs in real-time
npm run start:dev

# Debug mode
npm run start:debug

# Check for errors
Get-Content .\logs\error.log -Tail 50
```

---

## Next Steps

1. ✅ **Database Setup** - Complete
2. ✅ **Authentication** - Complete
3. 🔄 **Invoice Module** - In Progress
4. ⏳ **Inventory Module** - Pending
5. ⏳ **Supplier/Consumer Modules** - Pending
6. ⏳ **Finance Dashboard** - Pending
7. ⏳ **Business Dashboard** - Pending

---

## Additional Resources

- **GraphQL Playground:** [http://localhost:3000/graphql](http://localhost:3000/graphql)
- **API Documentation:** See `GRAPHQL_ENDPOINTS_NEW.md`
- **Database Schema:** See `database-schema.sql`
- **NestJS Documentation:** [https://docs.nestjs.com/](https://docs.nestjs.com/)
- **GraphQL Documentation:** [https://graphql.org/](https://graphql.org/)

---

## Support

For issues or questions:

1. Check this guide first
2. Review error messages carefully
3. Check database connections
4. Verify environment variables
5. Review logs in console

---

**Last Updated:** December 13, 2024
**Version:** 1.0.0
