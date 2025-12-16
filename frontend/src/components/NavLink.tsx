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
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative"
      style={{
        backgroundColor: isActive ? "#C0392B" : "transparent",
        color: "#ffffff",
        cursor: "pointer",
      }}
      onMouseOver={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "#C0392B";
        }
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {isPending && (
        <div className="absolute right-2">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
