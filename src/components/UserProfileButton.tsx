"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

export default function UserProfileButton({
  userName,
  userEmail,
  userImage,
}: {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (e) {
      console.error("Signout handshake failed", e);
    } finally {
      setLoading(false);
    }
  };

  const displayName = userName || userEmail?.split("@")[0] || "Agent";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-200 active:scale-[0.98]">
      {userImage ? (
        <img
          src={userImage}
          alt={displayName}
          className="w-8 h-8 rounded-full border border-[#1A1A22] object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[rgba(20,20,24,0.4)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-xs font-mono font-bold text-gray-400 shrink-0 backdrop-blur-md">
          {initials}
        </div>
      )}
      
      <div className="flex-1 min-w-0 text-left">
        <div className="text-xs font-bold text-white truncate font-mono">
          {displayName}
        </div>
        <div className="text-[10px] text-gray-500 truncate font-mono">
          {userEmail}
        </div>
      </div>

      <button
        onClick={handleSignOut}
        disabled={loading}
        title="Terminate Secure Connection"
        className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-gray-500 hover:text-red-400 transition-all duration-200 active:scale-90 cursor-pointer disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
