"use server";

import { cookies } from "next/headers";

export async function getChatRoomId(
  customerId: string
): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(`chat_room_${customerId}`)?.value || null;
}

export async function setChatRoomId(
  customerId: string,
  roomId: string
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(`chat_room_${customerId}`, roomId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}
