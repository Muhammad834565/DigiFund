"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  useGetOrCreatePrivateChatRoomMutation,
  useGetRoomMessagesQuery,
  useSendChatMessageMutation,
  useMessageReceivedSubscription,
  ChatMessageType,
} from "@/graphql/generated/graphql";
import { getChatRoomId, setChatRoomId } from "@/app/actions/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Send,
  X,
  Loader2,
  Hash,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";

interface ChatComponentProps {
  customerId: string;
  customerName: string;
  userId: string;
}

export default function ChatComponent({
  customerId,
  customerName,
  userId,
}: ChatComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [showRoomIdInput, setShowRoomIdInput] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get or create private chat room
  const [getOrCreateRoom, { loading: creatingRoom }] =
    useGetOrCreatePrivateChatRoomMutation();

  // Get previous messages
  const { data: messagesData, refetch: refetchMessages } =
    useGetRoomMessagesQuery({
      variables: { roomId: roomId || "" },
      skip: !roomId,
    });

  // Send message mutation
  const [sendChatMessage, { loading: sending }] = useSendChatMessageMutation();

  // Subscribe to new messages
  const { data: subscriptionData } = useMessageReceivedSubscription({
    variables: { roomId: roomId || "" },
    skip: !roomId,
  });

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Initialize chat room
  const initializeChatRoom = useCallback(async () => {
    try {
      // Check if we have a cached room ID
      const cachedRoomId = await getChatRoomId(customerId);

      if (cachedRoomId) {
        setRoomId(cachedRoomId);
        return;
      }

      // Create or get private chat room
      const result = await getOrCreateRoom({
        variables: {
          senderId: userId,
          receiverId: customerId,
        },
      });

      if (result.data?.getOrCreatePrivateChatRoom) {
        const newRoomId = result.data.getOrCreatePrivateChatRoom.id;
        setRoomId(newRoomId);
        await setChatRoomId(customerId, newRoomId);
      }
    } catch (error) {
      console.error("Error initializing chat room:", error);
    }
  }, [customerId, userId, getOrCreateRoom]);

  // Join room by ID
  const handleJoinRoomById = useCallback(() => {
    if (roomIdInput.trim()) {
      setMessages([]); // Clear messages when switching rooms
      setRoomError(null); // Clear any previous errors
      setRoomId(roomIdInput.trim());
      setChatRoomId(customerId, roomIdInput.trim());
      setShowRoomIdInput(false);
      setRoomIdInput("");
      // Refetch messages for new room
      setTimeout(() => refetchMessages(), 100);
    }
  }, [roomIdInput, customerId, refetchMessages]);

  // Change room (disconnect and show input)
  const handleChangeRoom = useCallback(() => {
    setMessages([]); // Clear current messages
    setRoomError(null); // Clear any errors
    setRoomId(null); // Disconnect from current room
    setShowRoomIdInput(true); // Show input to enter new room ID
    setRoomIdInput(""); // Clear input field
  }, []);

  // Copy room ID to clipboard
  const handleCopyRoomId = useCallback(async () => {
    if (roomId) {
      try {
        await navigator.clipboard.writeText(roomId);
        setCopiedRoomId(true);
        setTimeout(() => setCopiedRoomId(false), 2000);
      } catch (error) {
        console.error("Failed to copy room ID:", error);
      }
    }
  }, [roomId]);

  // Send message handler
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !roomId) return;

    try {
      await sendChatMessage({
        variables: {
          input: {
            roomId,
            senderId: userId,
            receiverId: customerId,
            message: message.trim(),
          },
        },
      });

      setMessage("");
      setRoomError(null); // Clear any previous errors on successful send
      // Refetch to ensure we have the latest messages
      setTimeout(() => refetchMessages(), 100);
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      // Check if it's a room not found error
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes("room not found")) {
        setRoomError(
          "This room doesn't exist. Please create a new room or join a different one."
        );
      } else {
        setRoomError("Failed to send message. Please try again.");
      }
    }
  }, [message, roomId, userId, customerId, sendChatMessage, refetchMessages]);

  // Initialize room when opened
  useEffect(() => {
    if (isOpen && !roomId) {
      initializeChatRoom();
    }
  }, [isOpen, roomId, initializeChatRoom]);

  // Load previous messages when room is ready
  useEffect(() => {
    if (messagesData?.chatRoomMessages) {
      setMessages(messagesData.chatRoomMessages as ChatMessageType[]);
    }
  }, [messagesData]);

  // Handle new messages from subscription
  useEffect(() => {
    if (subscriptionData?.messageReceived) {
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.id === subscriptionData.messageReceived.id
        );
        if (exists) return prev;
        return [...prev, subscriptionData.messageReceived];
      });
      scrollToBottom();
    }
  }, [subscriptionData, scrollToBottom]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Chat with {customerName}
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl flex flex-col">
      <CardHeader className="flex flex-col space-y-2 pb-3 border-b">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Chat with {customerName}</CardTitle>
          <div className="flex items-center gap-2">
            {!roomId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRoomIdInput(!showRoomIdInput)}
                className="h-8 w-8 p-0"
                title="Join room by ID"
              >
                <Hash className="w-4 h-4" />
              </Button>
            )}
            {roomId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangeRoom}
                className="h-8 w-8 p-0"
                title="Change room"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {showRoomIdInput && (
          <div className="flex gap-2">
            <Input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              placeholder="Enter room ID..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleJoinRoomById();
                }
              }}
              autoFocus
            />
            <Button
              onClick={handleJoinRoomById}
              disabled={!roomIdInput.trim()}
              size="sm"
            >
              Join
            </Button>
          </div>
        )}
        {roomId && (
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1.5 rounded">
            <span className="font-mono truncate">Room: {roomId}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyRoomId}
              className="h-6 w-6 p-0 shrink-0"
              title="Copy room ID"
            >
              {copiedRoomId ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Error Message */}
        {roomError && (
          <div className="bg-destructive/10 border-l-4 border-destructive px-4 py-3 mx-4 mt-4 rounded shrink-0">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-2">
                  {roomError}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRoomError(null);
                      handleChangeRoom();
                    }}
                    className="h-7 text-xs"
                  >
                    Change Room
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      setRoomError(null);
                      setRoomId(null);
                      await initializeChatRoom();
                    }}
                    className="h-7 text-xs"
                  >
                    Create New Room
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoomError(null)}
                className="h-6 w-6 p-0 shrink-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {creatingRoom ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.senderId === userId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">
                      {msg.message}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={!roomId || sending}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !roomId || sending}
              size="icon"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
