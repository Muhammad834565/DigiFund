"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import {
    useGetOrCreatePrivateChatRoomMutation,
    useGetRoomMessagesQuery,
    useSendChatMessageMutation,
    useMessageReceivedSubscription,
} from "@/graphql/generated/graphql";
import { toast } from "sonner";

interface SupplierChatProps {
    supplierPublicId: string;
    supplierName: string;
}

export function SupplierChat({
    supplierPublicId,
    supplierName,
}: SupplierChatProps) {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Get Room Mutation
    const [getRoom, { loading: roomLoading }] =
        useGetOrCreatePrivateChatRoomMutation();

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (open && !roomId) {
            try {
                const res = await getRoom({
                    variables: { receiverId: supplierPublicId },
                });
                if (res.data?.getOrCreatePrivateChatRoom?.id) {
                    setRoomId(res.data.getOrCreatePrivateChatRoom.id);
                }
            } catch (e: any) {
                toast.error("Failed to start chat: " + e.message);
            }
        }
    };

    // Messages Query
    const {
        data: messagesData,
        loading: messagesLoading,
        refetch,
    } = useGetRoomMessagesQuery({
        variables: { roomId: roomId! },
        skip: !roomId,
        fetchPolicy: "network-only",
    });

    // Send Mutation
    const [sendMessage, { loading: sendLoading }] = useSendChatMessageMutation();

    // Subscription
    useMessageReceivedSubscription({
        variables: { roomId: roomId! },
        skip: !roomId,
        onData: async ({ client, data: subData }) => {
            // Refresh messages when a new one arrives
            await refetch();
            scrollToBottom();
        },
    });

    const scrollToBottom = () => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesData, isOpen]);

    const handleSend = async () => {
        if (!message.trim() || !roomId) return;
        try {
            await sendMessage({
                variables: {
                    input: { roomId, message },
                },
            });
            setMessage("");
            await refetch();
            scrollToBottom();
        } catch (e: any) {
            toast.error("Failed to send: " + e.message);
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <MessageCircle className="w-4 h-4 mr-2" /> Chat with Supplier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col bg-white dark:bg-gray-900">
                <DialogHeader className="border-b pb-4 dark:border-gray-800">
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        Chat with {supplierName}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col mt-4 overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                    >
                        {roomLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : !roomId ? (
                            <div className="text-center text-gray-500 mt-10">Starting chat...</div>
                        ) : messagesLoading && !messagesData ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : messagesData?.chatRoomMessages?.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                No messages yet. Say hello!
                            </div>
                        ) : (
                            messagesData?.chatRoomMessages?.map((msg) => {
                                const isMe = msg.senderId !== supplierPublicId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? "items-end" : "items-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg text-sm ${isMe
                                                    ? "bg-blue-600 text-white rounded-br-none"
                                                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm"
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="pt-4 mt-auto">
                        <div className="flex gap-2">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                disabled={!roomId || sendLoading}
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                disabled={!roomId || sendLoading || !message.trim()}
                                className={sendLoading ? "opacity-50" : ""}
                            >
                                {sendLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
