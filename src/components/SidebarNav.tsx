"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Trophy, User, Zap, Terminal } from "lucide-react";

type SidebarNavProps = {
  isPro: boolean;
};

export default function SidebarNav({ isPro }: SidebarNavProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Terminal", icon: Terminal },
    { href: "/dashboard/city", label: "City Map", icon: Map },
    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/dashboard"
          ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/mission/") || pathname.startsWith("/dashboard/chapter/"))
          : pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              isActive 
                ? "glass-active" 
                : "hover:bg-[rgba(127,119,221,0.1)] hover:border hover:border-[rgba(127,119,221,0.3)] border border-transparent"
            }`}
            style={isActive ? undefined : { color: "#6B6A72" }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}

      {!isPro && (
        <Link
          href="/dashboard/upgrade"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold mt-2 transition-all hover:shadow-[0_0_15px_rgba(250,199,117,0.4)]"
          style={{
            background: "rgba(250,199,117,0.08)",
            color: "#FAC775",
            border: "1px solid rgba(250,199,117,0.3)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <Zap className="w-4 h-4 shrink-0" />
          Upgrade to Pro
        </Link>
      )}
    </nav>
  );
}
