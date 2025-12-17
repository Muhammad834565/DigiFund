"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden glass"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop & Mobile */}
            <div className={`
        fixed top-0 left-0 z-50 h-full w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex-shrink-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg">DigiFund</span>
                    <div className="w-8" /> {/* Spacer for centering */}
                </header>

                <main className="flex-1 overflow-y-auto w-full md:p-2 lg:p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
