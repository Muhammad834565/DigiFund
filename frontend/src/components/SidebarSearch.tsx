"use client";

import { Search } from "lucide-react";

export function SidebarSearch() {
  return (
    <div className="relative px-2">
      <Search
        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        placeholder="Search..."
        className="w-full py-2 pl-10 pr-3 rounded-lg border border-transparent bg-white/10 text-white placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none transition-all text-sm"
      />
    </div>
  );
}
