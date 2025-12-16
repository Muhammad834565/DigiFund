import { ApolloProvider } from "@/components/ApolloProvider";
import { NavLink } from "@/components/NavLink";
import { SidebarSearch } from "@/components/SidebarSearch";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  LogOut,
  Store,
  DollarSign,
  Package,
  Truck,
  User,
} from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider>
      <div
        className="flex h-screen"
        style={{ background: "var(--background)" }}
        suppressHydrationWarning
      >
        {/* Sidebar - Black with White Text */}
        <Sidebar />

        {/* Main Content */}
        <main
          className="ml-64 flex-1 overflow-y-auto p-8"
          style={{ background: "var(--background)" }}
        >
          {children}
        </main>
      </div>
    </ApolloProvider>
  );
}
