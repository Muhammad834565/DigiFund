"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getRagDataSummary, queryWithRag } from "@/app/actions/chat-rag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  sources?: string[];
  confidenceScore?: number;
  followUpSuggestions?: string[];
  timestamp: Date;
}

interface RagChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RagChatBox({ isOpen, onClose }: RagChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = useCallback(async () => {
    if (initialized) return;

    setLoading(true);
    try {
      const result = await getRagDataSummary();

      if (result.success) {
        const welcomeMessage: ChatMessage = {
          id: "welcome",
          type: "system",
          content:
            result.data ||
            `**Available database information:**
- Products: 7 products in catalog
- Customers: 3 customer records  
- Invoices: 4 sales transactions
- Users: 7 system users

**You can ask questions about:**
• Product inventory and pricing
• Customer information
• Sales history and revenue
• User accounts

**Example questions:**
• "What are the top 5 most expensive products?"
• "Which customers have made the most purchases?"
• "What was our total revenue last month?"
• "Which products are low on stock?"`,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        setInitialized(true);
      } else {
        toast.error(result.error || "Failed to initialize chat");
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Failed to initialize chat");
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // Initialize chat when component opens
  useEffect(() => {
    if (isOpen && !initialized) {
      initializeChat();
    }
  }, [isOpen, initialized, initializeChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessageContent = (content: string) => {
    // Enhanced markdown formatting for headings and text
    return content.split("\n").map((line, lineIndex) => {
      // Handle specific headings that should be bold
      if (
        line.includes("Available database information:") ||
        line.includes("You can ask questions about:") ||
        line.includes("Example questions:")
      ) {
        return (
          <div
            key={lineIndex}
            className="font-bold text-sm mb-2 mt-3 first:mt-0"
          >
            {line.replace(/\*\*/g, "")}
          </div>
        );
      }

      // Handle bullet points
      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <div key={lineIndex} className="flex items-start gap-2 ml-2 mb-1">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span className="flex-1">
              {line.replace(/^[•\-]\s*/, "").replace(/\*\*/g, "")}
            </span>
          </div>
        );
      }

      // Handle regular lines with bold formatting
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return line.trim() ? (
        <div key={lineIndex} className="mb-1">
          {renderedLine}
        </div>
      ) : (
        <br key={lineIndex} />
      );
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await queryWithRag(input.trim());

      if (result.success && result.data) {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          type: "bot",
          content: result.data.answer,
          sources: result.data.sources,
          confidenceScore: result.data.confidenceScore,
          followUpSuggestions: result.data.followUpSuggestions,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: "bot",
          content: `Sorry, I couldn't process your request: ${result.error || "Unknown error"}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: "bot",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              RAG Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-[400px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {loading && messages.length === 0 && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Initializing chat...</span>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : message.type === "system"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type !== "user" && (
                      <Bot className="h-4 w-4 mt-1 shrink-0" />
                    )}
                    {message.type === "user" && (
                      <User className="h-4 w-4 mt-1 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">
                        {renderMessageContent(message.content)}
                      </p>

                      {/* Confidence Score */}
                      {message.confidenceScore && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                          <TrendingUp className="h-3 w-3" />
                          Confidence:{" "}
                          {(message.confidenceScore * 100).toFixed(1)}%
                        </div>
                      )}

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Sources:
                          </p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            {message.sources.map((source, index) => (
                              <li key={index} className="truncate">
                                • {source}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Follow-up Suggestions */}
                      {message.followUpSuggestions &&
                        message.followUpSuggestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                              <Lightbulb className="h-3 w-3" />
                              Suggestions:
                            </p>
                            <div className="space-y-1">
                              {message.followUpSuggestions.map(
                                (suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      handleSuggestionClick(suggestion)
                                    }
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline block text-left"
                                  >
                                    {suggestion}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your data..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
