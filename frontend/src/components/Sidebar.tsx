"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
import { SidebarSearch } from "@/components/SidebarSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/NavLink";
import { logoutAction } from "@/app/actions/auth";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
  };

  if (!mounted) {
    return null;
  }

  return (
    <aside
      className="w-64 fixed top-0 left-0 h-screen overflow-y-auto"
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "15px",
      }}
      suppressHydrationWarning
    >
      <div className="mb-6 relative flex items-center justify-center">
        {/* Profile Button - Round Shape */}
        <Link
          href="/dashboard/profile"
          className="absolute left-0 w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
          title="Profile"
        >
          <User size={24} color="#ffffff" />
        </Link>

        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: "#ffffff" }}
        >
          DigiFund
        </h2>
      </div>

      {/* Search Bar */}
      <SidebarSearch />

      <nav className="space-y-1 px-2">
        <NavLink
          href="/dashboard"
          icon={<LayoutDashboard />}
          label="Dashboard"
        />
        <NavLink
          href="/dashboard/finance"
          icon={<DollarSign />}
          label="Finance"
        />
        <NavLink
          href="/dashboard/invoices"
          icon={<FileText />}
          label="Invoices"
        />
        <NavLink
          href="/dashboard/inventory"
          icon={<Package />}
          label="Inventory"
        />
        <NavLink
          href="/dashboard/suppliers"
          icon={<Truck />}
          label="Suppliers"
        />
        <NavLink
          href="/dashboard/customers"
          icon={<Users />}
          label="Customers"
        />
        <NavLink href="/shopping" icon={<Store />} label="Shopping" />
      </nav>

      <div className="absolute bottom-16 left-4">
        <ThemeToggle />
      </div>

      <div className="absolute bottom-4 left-4">
        <form action={logoutAction}>
          <button
            className="flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition-colors hover:bg-red-700"
            style={{
              color: "#ffffff",
              backgroundColor: "#C0392B",
            }}
            type="submit"
          >
            <LogOut size={20} /> Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
