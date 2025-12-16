# Troubleshooting Next.js SWC Native Binary Issues

## Problem

The native SWC binary (`@next/swc-win32-x64-msvc`) fails to load with:

```
A dynamic link library (DLL) initialization routine failed.
```

This causes Next.js to fall back to WASM bindings, which don't support Turbopack features.

## Root Cause

Missing or incompatible **Microsoft Visual C++ Redistributable** runtime libraries on Windows.

## Solution

### Step 1: Install Visual C++ Redistributable (REQUIRED)

1. Download the latest **Visual C++ Redistributable (x64)** from Microsoft:
   - Direct link: https://aka.ms/vs/17/release/vc_redist.x64.exe
   - Or visit: https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist

2. Run the installer as Administrator

3. **Restart your computer** after installation

### Step 2: Clean Reinstall After VC++ Install

After installing VC++ and rebooting, run these commands in PowerShell at `H:\invoice-app`:

```powershell
# Clean cache and dependencies
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall
npm install

# Rebuild native binary
npm rebuild @next/swc-win32-x64-msvc

# Start dev server
npm run dev
```

### Step 3: Verify Fix

After the above steps, `npm run dev` should show:

- ✓ No DLL initialization errors
- ✓ "Next.js 16.0.5 (Turbopack)" with no WASM fallback warnings
- ✓ Server running at http://localhost:3000 or 3001

## Alternative: Downgrade to Next.js 15 (if VC++ install fails)

If you cannot install Visual C++ Redistributable:

```powershell
npm install next@15.1.4 --save-exact
npm install
npm run dev
```

Next.js 15 has better WASM fallback support and doesn't require Turbopack.

## Still Having Issues?

1. **Check antivirus/Windows Defender**: Native `.node` files can get quarantined
   - Temporarily disable real-time scanning and retry
   - Add `H:\invoice-app\node_modules` to exclusions

2. **Verify Node.js architecture**:

   ```powershell
   node -p "process.arch"
   ```

   Should output `x64` (not `ia32`)

3. **Run as Administrator**: Some DLL operations require elevated privileges
   - Right-click PowerShell → "Run as Administrator"
   - Navigate to `H:\invoice-app` and retry `npm rebuild @next/swc-win32-x64-msvc`

4. **Check Windows version**: Ensure you're on Windows 10 (1809+) or Windows 11

## Fixed Configuration Issues

The following were already fixed:

- ✅ Removed duplicate `middleware.ts` (kept `src/middleware.ts`)
- ✅ Removed invalid `src/app/next.config.js`
- ✅ Fixed `tsconfig.json` jsx mode (`preserve` instead of `react-jsx`)

---

# GraphQL Backend Connection Issues

## Problem

Getting errors like:

```
POST /graphql 404
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## Root Cause

Your Next.js frontend is trying to connect to a GraphQL backend server that isn't running.

## Solution

### Option 1: Start Your GraphQL Backend Server

If you have a separate GraphQL backend (recommended), start it on port 4000:

```bash
# Navigate to your backend directory and start the server
# The exact command depends on your backend setup
cd path/to/your/graphql-backend
npm start  # or yarn start, or your specific command
```

Your GraphQL server should be running at `http://localhost:4000/graphql`

### Option 2: Update Environment Variables

If your GraphQL server runs on a different port, update `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:YOUR_PORT/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:YOUR_PORT/graphql
```

Then restart the Next.js dev server:

```powershell
# Press Ctrl+C to stop the current server
npm run dev
```

### Option 3: Create a Next.js API Route (Alternative)

If you want to run GraphQL within Next.js, you'll need to create API routes. This is not currently set up in your project.

## Verify Backend is Running

Test your GraphQL endpoint:

```powershell
# Using curl (if available)
curl -X POST http://localhost:4000/graphql -H "Content-Type: application/json" -d '{"query":"{ __typename }"}'

# Using PowerShell
Invoke-WebRequest -Uri http://localhost:4000/graphql -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"query":"{ __typename }"}'
```

If successful, you should see JSON data, not an HTML error page.
