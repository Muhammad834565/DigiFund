# DigiFund Backend - Quick Reference Card

## 🚀 Quick Start (3 Commands)

```powershell
npm install && npm install nodemailer
psql -U postgres -c "CREATE DATABASE digifund_ecommerce;" && psql -U postgres -d digifund_ecommerce -f database-schema.sql
Copy-Item .env.example .env && npm run start:dev
```

## 📡 GraphQL Playground

**URL:** http://localhost:3000/graphql

## 🔑 Essential Environment Variables

```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=random-32-char-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 📝 Test Workflow

### 1. Signup

```graphql
mutation {
  signup(
    input: {
      contact_person: "Test"
      email: "test@test.com"
      phone_no: "+123"
      password: "Test123"
      role: "business_owner"
    }
  ) {
    message
    email
  }
}
```

### 2. Verify OTP (check email)

```graphql
mutation {
  verifyOtp(
    input: { email: "test@test.com", otp: "123456", purpose: "signup" }
  ) {
    success
    message
  }
}
```

### 3. Login

```graphql
mutation {
  login(input: { email: "test@test.com", password: "Test123" }) {
    token
    public_id
    role
  }
}
```

### 4. Set Header (copy token from login)

```json
{ "Authorization": "Bearer YOUR_TOKEN_HERE" }
```

### 5. Get Profile

```graphql
query {
  me {
    public_id
    email
    company_name
    role
  }
}
```

## 🆔 User Roles & Prefixes

| Role              | Prefix | Example  |
| ----------------- | ------ | -------- |
| Guest User        | gus    | gus-001  |
| Supplier          | sup    | sup-002  |
| Consumer          | cos    | cos-003  |
| Inventory Manager | inv    | inv-004  |
| Financial Manager | fin    | fin-005  |
| Student           | stu    | stu-006  |
| Business Owner    | digi   | digi-007 |

## 🔒 OTP Rules

- ⏱️ Expires: 3 minutes
- 🔢 Max attempts: 5 per OTP
- 📅 Daily limit: 5 OTPs per email

## 🗄️ Database Commands

```powershell
# View tables
psql -U postgres -d digifund_ecommerce -c "\dt"

# View users
psql -U postgres -d digifund_ecommerce -c "SELECT public_id, email, role FROM user_main;"

# Reset database
psql -U postgres -c "DROP DATABASE digifund_ecommerce;" && psql -U postgres -c "CREATE DATABASE digifund_ecommerce;" && psql -U postgres -d digifund_ecommerce -f database-schema.sql
```

## 🐛 Troubleshooting

| Problem              | Solution                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Port 3000 in use     | `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess` then `Stop-Process -Id PID` |
| DB connection failed | `net start postgresql-x64-14`                                                                      |
| Module not found     | `npm install`                                                                                      |
| Email not sending    | Use Ethereal: https://ethereal.email                                                               |
| OTP expired          | Request new OTP (resend signup)                                                                    |

## 📂 Key Files

| File                     | Purpose            |
| ------------------------ | ------------------ |
| database-schema.sql      | Database structure |
| .env                     | Configuration      |
| README_DIGIFUND_API.md   | Full documentation |
| SETUP_GUIDE.md           | Setup instructions |
| GRAPHQL_ENDPOINTS_NEW.md | API reference      |

## ✅ Implementation Status

- ✅ Authentication (100%)
- ✅ Database Schema (100%)
- ✅ OTP System (100%)
- ✅ Email Service (100%)
- 🔄 Invoice Module (70% - needs resolver)
- 🔄 Inventory Module (30% - needs service)
- 🔄 Relationships Module (30% - needs service)
- 🔄 Finance Dashboard (20% - needs service)
- 🔄 Business Dashboard (20% - needs service)

## 🔐 Security Checklist

- ✅ Password hashing (bcrypt)
- ✅ JWT tokens (7 days)
- ✅ OTP expiry (3 min)
- ✅ Rate limiting (5 attempts)
- ✅ Server-side token validation
- ✅ Secure cookies (httpOnly)
- ⚠️ HTTPS (production only)
- ⚠️ CORS (configure for production)

## 📧 Email Setup (Gmail)

1. Enable 2FA: https://myaccount.google.com/security
2. App Passwords: https://myaccount.google.com/apppasswords
3. Copy 16-char password to EMAIL_PASSWORD in .env

## 🎯 Next Steps

1. ✅ Run database schema
2. ✅ Configure .env
3. ✅ Test authentication
4. 🔄 Implement invoice resolver
5. 🔄 Implement inventory service
6. 🔄 Implement relationships service
7. 🔄 Implement dashboards

## 📞 Support Resources

- GraphQL Docs: /graphql (Documentation Explorer)
- NestJS Docs: https://docs.nestjs.com
- TypeORM Docs: https://typeorm.io
- GraphQL Docs: https://graphql.org

---

**Quick Help:**

- Application: `npm run start:dev`
- Database: `psql -U postgres -d digifund_ecommerce`
- Logs: Check terminal output
- Errors: Check console for detailed messages

**Port:** 3000  
**Database:** digifund_ecommerce  
**GraphQL:** /graphql

---

_Keep this file handy for quick reference!_
