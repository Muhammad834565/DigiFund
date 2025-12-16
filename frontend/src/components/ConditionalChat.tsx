"use client";

import { usePathname } from "next/navigation";
import { FloatingChatIcon } from "@/components/FloatingChatIcon";

export function ConditionalChat() {
  const pathname = usePathname();

  // Hide chat on login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return <FloatingChatIcon />;
}
