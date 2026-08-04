"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Map, Database, FileCode2, Skull, Key } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
  { name: "Neural City", icon: Map, href: "/dashboard/city" },
  { name: "Districts", icon: Database, href: "/dashboard/city" },
  { name: "Missions", icon: FileCode2, href: "/dashboard/city" }, // Fallback to city for now
  { name: "Archives", icon: Skull, href: "#" },
  { name: "Terminal", icon: Terminal, href: "/dashboard" },
];

export function NeuralToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  
  const { data: session } = authClient.useSession();

  // Derive active item from current route
  const getActiveItem = () => {
    if (pathname === "/dashboard") return "Terminal";
    if (pathname.includes("/dashboard/city") || pathname.includes("/dashboard/chapter")) {
      return "Districts"; 
    }
    return "Terminal"; // default
  };
  
  const active = getActiveItem();

  // Hide the toolbar on pages where it causes clutter or breaks immersion
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.includes("/dashboard/mission")
  ) {
    return null;
  }

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto os-window px-2 py-2 flex items-center gap-1"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.name;
        const isHovered = hovered === item.name;

        return (
          <button
            key={item.name}
            onClick={() => router.push(item.href)}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "relative px-4 py-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase transition-colors duration-200 cursor-none",
              isActive ? "text-white" : "text-[#9998A3] hover:text-[#E8E8F0]"
            )}
          >
            {/* Sliding Background for Active State */}
            {isActive && (
              <motion.div
                layoutId="toolbar-active"
                className="absolute inset-0 bg-[rgba(127,119,221,0.15)] border border-[rgba(127,119,221,0.3)] rounded-xl pointer-events-none"
                initial={false}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}
            
            {/* Hover Indicator */}
            {isHovered && !isActive && (
              <motion.div
                layoutId="toolbar-hover"
                className="absolute inset-0 bg-[rgba(255,255,255,0.05)] rounded-xl pointer-events-none"
                initial={false}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}

            <Icon className="w-4 h-4 relative z-10 pointer-events-none" />
            <span className="relative z-10 whitespace-nowrap pointer-events-none">{item.name}</span>
          </button>
        );
      })}

      <div className="w-[1px] h-8 bg-white/10 mx-2" />

      {session ? (
        <button 
          onClick={async () => {
            await authClient.signOut();
            router.push("/login");
          }}
          className="relative px-4 py-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-red-400 hover:bg-red-400/10 transition-colors duration-200 cursor-none"
        >
          <Key className="w-4 h-4" />
          Disconnect
        </button>
      ) : (
        <Link 
          href="/login"
          className="relative px-4 py-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#5DCAA5] hover:bg-[rgba(29,158,117,0.1)] transition-colors duration-200 cursor-none"
        >
          <Key className="w-4 h-4" />
          Agent Login
        </Link>
      )}
    </motion.div>
  );
}
