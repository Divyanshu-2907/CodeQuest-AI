"use client";

import { Flame, Cpu } from "lucide-react";

type UserData = {
  level: number;
  xp: number;
  streak: number;
  username: string | null;
  name: string | null;
  image: string | null;
};

const getRankLabel = (level: number) => {
  if (level >= 16) return "AI Overlord";
  if (level >= 11) return "Neural Architect";
  if (level >= 7) return "ML Hustler";
  if (level >= 4) return "Data Runner";
  return "Script Kiddie";
};

const getRankColor = (level: number) => {
  if (level >= 16) return "#F0997B";
  if (level >= 11) return "#7F77DD";
  if (level >= 7) return "#5DCAA5";
  if (level >= 4) return "#FAC775";
  return "#6B6A72";
};

export default function PlayerHUD() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch user data");
        return r.json();
      })
      .then((data) => {
        setUserData(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !userData) {
    return (
      <div
        className="h-16 border-b flex items-center px-6 gap-3"
        style={{ background: "rgba(10,10,13,0.9)", borderColor: "#1A1A22" }}
      >
        <div
          className="w-8 h-8 rounded-full animate-pulse"
          style={{ background: "#1A1A22" }}
        />
        <div className="flex flex-col gap-1.5">
          <div className="w-24 h-2.5 rounded animate-pulse" style={{ background: "#1A1A22" }} />
          <div className="w-16 h-2 rounded animate-pulse" style={{ background: "#1A1A22" }} />
        </div>
      </div>
    );
  }

  const rank = getRankLabel(userData.level);
  const rankColor = getRankColor(userData.level);
  const nextLevelXp = userData.level * 500;
  const xpProgress = Math.min((userData.xp / nextLevelXp) * 100, 100);
  const displayName = userData.username || userData.name || "Agent";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div
      className="sticky top-0 z-50 border-b flex items-center justify-between px-6 py-3 backdrop-blur-xl"
      style={{ background: "rgba(15,15,18,0.6)", borderColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Left: avatar + name */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {userData.image ? (
            <img
              src={userData.image}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
              style={{ border: `1.5px solid ${rankColor}` }}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full bg-[#1A1A22] flex items-center justify-center font-mono text-xs font-bold text-gray-400"
              style={{ border: `1.5px solid ${rankColor}` }}
            >
              {initials}
            </div>
          )}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 active-dot"
            style={{ background: "#1D9E75", borderColor: "#080809" }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white">{displayName}</span>
            <span
              className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: `${rankColor}18`,
                color: rankColor,
                border: `1px solid ${rankColor}40`,
              }}
            >
              LVL {userData.level}
            </span>
          </div>
          <div className="font-mono text-[10px] mt-0.5" style={{ color: rankColor }}>
            {rank}
          </div>
        </div>
      </div>

      {/* Center: XP bar */}
      <div className="hidden md:flex flex-col items-center gap-1 min-w-[180px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-mono text-[10px]" style={{ color: "#6B6A72" }}>XP</span>
          <span className="font-mono text-[10px]" style={{ color: "#9998A3" }}>
            {userData.xp.toLocaleString()} / {nextLevelXp.toLocaleString()}
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden relative xp-shimmer"
          style={{ background: "#1A1A22" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${xpProgress}%`, background: "#7F77DD" }}
          />
        </div>
      </div>

      {/* Right: streak + rank */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: userData.streak > 0 ? "rgba(234,100,30,0.1)" : "rgba(20,20,24,0.4)",
            border: `1px solid ${userData.streak > 0 ? "rgba(234,100,30,0.3)" : "rgba(255,255,255,0.05)"}`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <Flame
            className="w-3.5 h-3.5"
            style={{ color: userData.streak > 0 ? "#EA641E" : "#3A3A45" }}
          />
          <div>
            <div className="font-mono text-[9px]" style={{ color: "#6B6A72" }}>STREAK</div>
            <div className="font-mono text-xs font-bold" style={{ color: userData.streak > 0 ? "#EA641E" : "#3A3A45" }}>
              {userData.streak}d
            </div>
          </div>
        </div>

        {/* CPU / Rank badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(127,119,221,0.15)]"
          style={{ background: "rgba(127,119,221,0.08)", border: "1px solid rgba(127,119,221,0.4)", backdropFilter: "blur(12px)" }}
        >
          <Cpu className="w-3.5 h-3.5" style={{ color: "#7F77DD" }} />
          <div>
            <div className="font-mono text-[9px]" style={{ color: "#534AB7" }}>AGENT</div>
            <div className="font-mono text-xs font-bold" style={{ color: "#7F77DD" }}>ONLINE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
