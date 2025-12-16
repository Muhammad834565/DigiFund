# DigiFund Backend - Installation Commands

## Quick Setup (Run these commands in order)

### 1. Install Core Dependencies

```powershell
npm install
```

### 2. Install Additional Required Packages

```powershell
npm install nodemailer
npm install @types/nodemailer --save-dev
```

### 3. Setup Database

```powershell
# Start PostgreSQL (if not running)
net start postgresql-x64-14

# Create database and run schema
psql -U postgres -c "CREATE DATABASE digifund_ecommerce;"
psql -U postgres -d digifund_ecommerce -f database-schema.sql
```

### 4. Configure Environment

```powershell
# Copy environment template
Copy-Item .env.example .env

# Open .env in editor and update values
code .env
```

### 5. Run Application

```powershell
npm run start:dev
```

---

## Complete Fresh Setup (If starting from scratch)

```powershell
# Navigate to project
cd h:\project\nextgenesollearning\project\digifund\ecomerce\backend

# Clean install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Install all dependencies
npm install
npm install nodemailer
npm install @types/nodemailer --save-dev

# Setup database
net start postgresql-x64-14
psql -U postgres -c "DROP DATABASE IF EXISTS digifund_ecommerce;"
psql -U postgres -c "CREATE DATABASE digifund_ecommerce;"
psql -U postgres -d digifund_ecommerce -f database-schema.sql

# Setup environment
Copy-Item .env.example .env

# Run application
npm run start:dev
```

---

## Verify Installation

```powershell
# Check Node.js version
node --version

# Check PostgreSQL version
psql --version

# Check if PostgreSQL is running
Get-Service postgresql-x64-14

# Verify database exists
psql -U postgres -l | Select-String "digifund_ecommerce"

# Check database tables
psql -U postgres -d digifund_ecommerce -c "\dt"

# Test application
Invoke-WebRequest http://localhost:3000/graphql
```

---

## Common Installation Issues

### Issue: npm install fails

```powershell
# Solution: Clean cache and reinstall
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: bcrypt installation fails

```powershell
# Solution: Install build tools
npm install --global windows-build-tools
npm install bcrypt --force
```

### Issue: PostgreSQL not found

```powershell
# Solution: Add PostgreSQL to PATH
$env:Path += ";C:\Program Files\PostgreSQL\14\bin"
# Or add permanently through System Environment Variables
```

---

## Development Dependencies (Optional)

### Install Globally (Optional but recommended)

```powershell
# NestJS CLI
npm install -g @nestjs/cli

# TypeScript
npm install -g typescript

# Nodemon (for auto-restart)
npm install -g nodemon
```

---

## Production Build

```powershell
# Build application
npm run build

# Start production server
npm run start:prod
```

---

## Database Reset (Development Only)

```powershell
# Reset database and data
psql -U postgres -c "DROP DATABASE IF EXISTS digifund_ecommerce;"
psql -U postgres -c "CREATE DATABASE digifund_ecommerce;"
psql -U postgres -d digifund_ecommerce -f database-schema.sql
```

---

## Environment Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] PostgreSQL installed (v14+)
- [ ] PostgreSQL service running
- [ ] Database created
- [ ] Schema loaded
- [ ] .env file created
- [ ] Email credentials configured
- [ ] JWT secret generated
- [ ] Dependencies installed
- [ ] Application starts successfully

---

## Next Steps After Installation

1. Open GraphQL Playground: http://localhost:3000/graphql
2. Test signup endpoint
3. Check email for OTP
4. Verify OTP
5. Login to get JWT token
6. Test protected endpoints

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.
