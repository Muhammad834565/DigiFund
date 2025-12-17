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
  X,
} from "lucide-react";
import { SidebarSearch } from "@/components/SidebarSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/NavLink";
import { logoutAction } from "@/app/actions/auth";
import { useState, useEffect } from "react";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <aside className="h-full flex flex-col bg-black text-white p-4 overflow-y-auto relative">
      {/* Mobile Close Button - Only visible on small screens */}
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}

      <div className="mb-8 mt-2 relative flex items-center justify-center">
        {/* Profile Button - Round Shape */}
        <Link
          href="/dashboard/profile"
          className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/25 shrink-0"
          title="Profile"
        >
          <User size={20} className="text-white" />
        </Link>
        
        <h2 className="text-2xl font-bold tracking-tight text-white ml-8">
          DigiFund
        </h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SidebarSearch />
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2">
        <div onClick={onClose}><NavLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" /></div>
        <div onClick={onClose}><NavLink href="/dashboard/finance" icon={<DollarSign />} label="Finance" /></div>
        <div onClick={onClose}><NavLink href="/dashboard/invoices" icon={<FileText />} label="Invoices" /></div>
        <div onClick={onClose}><NavLink href="/dashboard/inventory" icon={<Package />} label="Inventory" /></div>
        <div onClick={onClose}><NavLink href="/dashboard/suppliers" icon={<Truck />} label="Suppliers" /></div>
        <div onClick={onClose}><NavLink href="/dashboard/customers" icon={<Users />} label="Customers" /></div>
        <div onClick={onClose}><NavLink href="/shopping" icon={<Store />} label="Shopping v1" /></div>
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Theme</span>
          <ThemeToggle />
        </div>

        <form action={logoutAction} className="block w-full">
          <button
            className="w-full flex items-center justify-center gap-2 font-medium py-2.5 px-4 rounded-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] bg-[#C0392B] text-white hover:bg-red-700 shadow-md hover:shadow-red-900/20"
            type="submit"
          >
            <LogOut size={18} /> 
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
