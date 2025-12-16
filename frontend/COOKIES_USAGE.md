# 🍪 Using Cookies - User ID & Access Token

## ✅ What's Configured

Your login now saves **two cookies**:

1. `access_token` - JWT token for authentication
2. `user_id` - User's ID for easy access

Both cookies are:

- ✅ HTTP-only (secure, not accessible via JavaScript)
- ✅ Valid for 24 hours
- ✅ Secure in production

---

## 📝 Updated Login Mutation

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
    userId
  }
}
```

---

## 🎯 How to Use User ID

### In Server Components or Server Actions

```tsx
// src/app/dashboard/page.tsx
import { getUserId } from "@/app/actions/auth";

export default async function DashboardPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Your User ID: {userId}</p>
    </div>
  );
}
```

### In Server Actions

```tsx
// src/app/actions/invoice.ts
"use server";

import { getUserId } from "./auth";

export async function createInvoiceAction(formData: FormData) {
  const userId = await getUserId();

  if (!userId) {
    return { error: "Not authenticated" };
  }

  // Use userId in your GraphQL mutation
  const mutation = `
    mutation CreateInvoice($input: CreateInvoiceInput!) {
      createInvoice(input: $input) {
        id
        total
      }
    }
  `;

  // ... rest of your code
}
```

### In API Routes

```tsx
// src/app/api/user/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("access_token")?.value;

  if (!userId || !token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ userId });
}
```

---

## 🔐 Example: Using User ID with GraphQL Hooks

### Send Chat Message with User ID

```tsx
"use client";

import { useSendChatMessageMutation } from "@/graphql/generated/graphql";
import { useEffect, useState } from "react";

export default function ChatComponent({ roomId }: { roomId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sendMessage] = useSendChatMessageMutation();

  // Fetch userId from an API route (since client components can't access cookies directly)
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUserId(data.userId));
  }, []);

  const handleSend = async () => {
    if (!userId || !message.trim()) return;

    await sendMessage({
      variables: {
        input: {
          roomId,
          senderId: userId,
          message,
        },
      },
    });

    setMessage("");
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} disabled={!userId}>
        Send
      </button>
    </div>
  );
}
```

---

## 🛠️ Helper Functions You Can Add

### Get Access Token

```tsx
// src/app/actions/auth.ts
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}
```

### Check if User is Authenticated

```tsx
// src/app/actions/auth.ts
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userId = cookieStore.get("user_id")?.value;
  return !!(token && userId);
}
```

### Logout Function

```tsx
// src/app/actions/auth.ts
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("user_id");
  redirect("/login");
}
```

---

## 📋 Complete Example: Protected Dashboard

```tsx
// src/app/dashboard/page.tsx
import { getUserId } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as User ID: {userId}</p>
      {/* Your dashboard content */}
    </div>
  );
}
```

---

## 🔑 API Route to Get User ID (for Client Components)

```tsx
// src/app/api/user/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("access_token")?.value;

  if (!userId || !token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ userId, authenticated: true });
}
```

Then use it in client components:

```tsx
"use client";

import { useEffect, useState } from "react";

export default function UserProfile() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.userId) {
          setUserId(data.userId);
        }
      })
      .catch((err) => console.error("Not authenticated"));
  }, []);

  if (!userId) return <div>Loading...</div>;

  return <div>User ID: {userId}</div>;
}
```

---

## 🎉 Summary

✅ **Login saves both `access_token` and `user_id` to cookies**  
✅ **Use `getUserId()` in server components/actions**  
✅ **Create an API route to access userId in client components**  
✅ **All cookies are HTTP-only and secure**

**Now you can easily access the logged-in user's ID throughout your app!**
