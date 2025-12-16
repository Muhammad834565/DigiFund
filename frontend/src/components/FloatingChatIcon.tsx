"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { RagChatBox } from "./RagChatBox";

export function FloatingChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(true);
    const rect = iconRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isMouseDown) {
        // Only start dragging after mouse has moved
        if (!isDragging) {
          setIsDragging(true);
        }
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isMouseDown, isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setIsDragging(false);
  }, []);

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isMouseDown, handleMouseMove, handleMouseUp]);

  const handleClick = () => {
    // Only open chat if not dragging
    if (!isDragging) {
      setIsOpen(true);
    }
  };

  // Hide the floating chat on customer detail pages
  const shouldHideChat =
    pathname?.includes("/customers/") &&
    !pathname?.includes("/customers/create");

  // Don't render anything if we should hide the chat
  if (shouldHideChat) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Icon - Only show when chat is closed */}
      {!isOpen && (
        <div
          ref={iconRef}
          className="fixed z-40 cursor-move"
          style={{
            left: position.x === 0 ? "auto" : `${position.x}px`,
            top: position.y === 0 ? "auto" : `${position.y}px`,
            right: position.x === 0 ? "1.5rem" : "auto",
            bottom: position.y === 0 ? "1.5rem" : "auto",
          }}
          onMouseDown={handleMouseDown}
        >
          <Button
            onClick={handleClick}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-500 hover:bg-blue-600 select-none"
            size="sm"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="sr-only">Open chat</span>
          </Button>
        </div>
      )}

      {/* Chat Box */}
      <RagChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
