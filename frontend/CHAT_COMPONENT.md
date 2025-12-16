# 💬 Chat Component - Complete Implementation

## ✅ What's Been Created

A fully functional real-time chat component that:

- ✅ Gets sender ID (userId) from cookies
- ✅ Uses customer ID as receiver ID
- ✅ Creates or retrieves private chat room
- ✅ Stores room ID in cookies for persistence
- ✅ Loads previous messages
- ✅ Receives real-time messages via WebSocket subscription
- ✅ Sends messages to the chat room
- ✅ Beautiful floating chat UI

---

## 📁 Files Created/Modified

### New Files:

1. **`src/app/actions/chat.ts`** - Server actions for chat room cookies
2. **`src/components/ChatComponent.tsx`** - Main chat component

### Modified Files:

1. **`src/app/dashboard/customers/view/[id]/page.tsx`** - Added chat to customer view

---

## 🎯 How It Works

### Flow:

1. **User opens customer view page**
   - Page gets logged-in userId from cookies
   - Passes userId and customerId to ChatComponent

2. **User clicks "Chat with [Customer]" button**
   - Component opens as floating chat window
   - Checks cookies for existing room ID
   - If no room exists, creates new private room via GraphQL mutation
   - Stores room ID in cookies for next time

3. **Chat loads previous messages**
   - Uses `GetRoomMessages` query to fetch history

4. **Real-time updates**
   - Subscribes to `MessageReceived` subscription
   - New messages appear instantly

5. **User sends messages**
   - Uses `SendChatMessage` mutation
   - Message appears in chat immediately

---

## 🔧 GraphQL Operations Used

The component uses your generated hooks from `codegen`:

```tsx
// Create or get private chat room
useGetOrCreatePrivateChatRoomMutation();

// Get previous messages
useGetRoomMessagesQuery({ variables: { roomId } });

// Send message
useSendChatMessageMutation();

// Subscribe to new messages (real-time)
useMessageReceivedSubscription({ variables: { roomId } });
```

---

## 🍪 Cookie Storage

### Chat Room ID Storage:

```
Cookie Name: chat_room_{customerId}
Value: room-id-uuid
Max Age: 30 days
```

**Benefits:**

- ✅ Remembers chat room between sessions
- ✅ Doesn't need to create new room each time
- ✅ Loads previous conversation history
- ✅ HTTP-only for security

---

## 🎨 Features

### UI/UX:

- 🎈 Floating chat button (bottom-right)
- 💬 Full-featured chat window
- 📜 Scrollable message history
- ⚡ Real-time message delivery
- ⌨️ Enter key to send
- 🔄 Auto-scroll to latest message
- ⏳ Loading states
- ❌ Close/minimize chat

### Message Display:

- Different colors for sent/received messages
- Timestamps for each message
- Word wrapping for long messages
- Auto-scroll to bottom

### Technical:

- TypeScript type safety
- Error handling
- Loading indicators
- Disabled states during sending
- No duplicate messages from subscription

---

## 📖 Usage Example

### In Customer View Page:

```tsx
import ChatComponent from "@/components/ChatComponent";
import { getUserId } from "@/app/actions/auth";

export default async function ViewCustomerPage() {
  const userId = await getUserId(); // From cookies
  const customerId = "123"; // From route params

  return (
    <div>
      {/* Your customer info */}

      {/* Chat Component */}
      {userId && (
        <ChatComponent
          customerId={customerId}
          customerName="John Doe"
          userId={userId}
        />
      )}
    </div>
  );
}
```

---

## 🔄 Message Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User opens customer view page                            │
│    → getUserId() from cookies                               │
│    → Pass userId + customerId to ChatComponent              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User clicks "Chat with Customer" button                  │
│    → Check cookie for existing room ID                      │
│    → If not found: getOrCreatePrivateChatRoom()             │
│    → Store room ID in cookie                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Load chat history                                        │
│    → useGetRoomMessagesQuery({ roomId })                    │
│    → Display all previous messages                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Subscribe to real-time updates                           │
│    → useMessageReceivedSubscription({ roomId })             │
│    → New messages appear instantly                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. User sends message                                       │
│    → useSendChatMessageMutation()                           │
│    → Message saved to database                              │
│    → Subscription broadcasts to all participants            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing the Chat

### Step 1: Login

```
1. Go to /login
2. Login with your credentials
3. This saves userId to cookies
```

### Step 2: View Customer

```
1. Go to /dashboard/customers
2. Click "View" on any customer
3. You'll see the floating "Chat with [Name]" button
```

### Step 3: Start Chat

```
1. Click the chat button
2. Chat window opens
3. First time: Creates new private room
4. Next times: Loads existing room + history
```

### Step 4: Send Messages

```
1. Type message in input field
2. Press Enter or click Send button
3. Message appears instantly
```

### Step 5: Test Real-time (Optional)

```
1. Open the same customer page in two browsers
2. Login as different users in each
3. Send messages from one browser
4. Watch them appear in the other browser instantly!
```

---

## 🎨 Customization

### Change Chat Position:

```tsx
// In ChatComponent.tsx, change these classes:
className = "fixed bottom-6 right-6"; // Button position
className = "fixed bottom-6 right-6"; // Chat window position

// Example: Move to bottom-left
className = "fixed bottom-6 left-6";
```

### Change Chat Size:

```tsx
// In ChatComponent.tsx
className = "w-96 h-[500px]"; // Current: 384px wide, 500px tall

// Example: Bigger chat
className = "w-[500px] h-[600px]";
```

### Change Colors:

The component uses Tailwind/Shadcn classes:

- `bg-primary` - Your messages (blue by default)
- `bg-muted` - Their messages (gray by default)

---

## 🔒 Security Notes

✅ **What's Secure:**

- User ID stored in HTTP-only cookies (not accessible via JS)
- Room IDs stored in HTTP-only cookies
- All mutations require authentication (access_token in cookies)

⚠️ **Remember:**

- Backend should validate that userId from token matches senderId
- Backend should verify user has permission to access chat room

---

## 📝 Server Actions Explained

### `getChatRoomId(customerId)`

```tsx
// Retrieves cached room ID for a specific customer
const roomId = await getChatRoomId("customer-123");
// Returns: 'room-456' or null
```

### `setChatRoomId(customerId, roomId)`

```tsx
// Stores room ID in cookie for future use
await setChatRoomId("customer-123", "room-456");
// Creates cookie: chat_room_customer-123 = room-456
```

---

## 🎉 You're All Set!

The chat component is now fully integrated and ready to use!

**What you get:**
✅ Real-time messaging  
✅ Message history  
✅ Cookie-based room persistence  
✅ Type-safe GraphQL operations  
✅ Beautiful UI  
✅ Mobile-responsive

**Next visit to same customer:**

- Chat instantly loads previous conversation
- No need to create room again
- All history preserved

**Happy Chatting! 💬**
