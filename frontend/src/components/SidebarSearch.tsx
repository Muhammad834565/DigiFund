"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function SidebarSearch() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6 px-2">
      <Search
        className="absolute left-5 top-1/2 transform -translate-y-1/2 transition-colors"
        size={16}
        style={{ color: isFocused ? "#000000" : "#999" }}
      />
      <input
        type="text"
        placeholder="Search..."
        className="w-full py-2 pl-10 pr-3 rounded-lg border-none outline-none text-sm transition-all"
        style={{
          backgroundColor: isFocused ? "#ffffff" : "#222",
          color: isFocused ? "#000000" : "#ffffff",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
