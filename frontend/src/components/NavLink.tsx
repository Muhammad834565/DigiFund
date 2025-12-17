"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Exact match for /dashboard, startsWith for sub-routes
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all relative text-white group
        ${isActive ? "bg-[#C0392B] shadow-md shadow-red-900/20" : "hover:bg-white/10 hover:translate-x-1"}
      `}
    >
      {isPending && (
        <div className="absolute right-2 animate-spin">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={`text-lg transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>{icon}</span>
      <span>{label}</span>

      {/* Active Indicator Strip */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white rounded-r-full" />
      )}
    </Link>
  );
}
