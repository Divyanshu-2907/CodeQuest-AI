"use client";

import { useEffect, useState } from "react";
import { Shield, Flame, CheckCircle, Trophy, Lock, Cpu, Droplet, Database, Zap, Crown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const iconMap: Record<string, any> = {
  Droplet: Droplet,
  Database: Database,
  Flame: Flame,
  Zap: Zap,
  CheckCircle: CheckCircle,
  Cpu: Cpu,
  Crown: Crown,
};

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [globalRank, setGlobalRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      fetch("/api/user/me").then(res => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      }),
      fetch("/api/leaderboard").then(res => res.json()).catch(() => ({ callerRank: null }))
    ])
      .then(([userData, leaderboardData]) => {
        setData(userData);
        setGlobalRank(leaderboardData.callerRank || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-[var(--color-primary)]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-sm tracking-wider uppercase animate-pulse">Infiltrating Profile Node...</span>
      </div>
    );
  }

  if (!data || !data.user) {
    return <div className="p-8 text-white">Could not fetch profile data.</div>;
  }

  const { user, allBadges } = data;
  const completedMissionsCount = user.userMissions.filter((m: any) => m.status === "COMPLETED").length;
  const earnedBadgesIds = user.userBadges.map((ub: any) => ub.badgeId);

  // Format XP History for the AreaChart
  const chartData = user.xpHistories.map((history: any) => ({
    date: format(new Date(history.date), "MMM dd"),
    xp: history.amount
  }));

  // If no history, add placeholder
  if (chartData.length === 0) {
    chartData.push({ date: "Today", xp: 0 });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2A35] pb-6">
        <div>
          <div className="heading-tag mb-3">
            // AGENT_PROFILE
          </div>
          <h1 className="city-heading text-4xl md:text-5xl" data-text="YOUR RECORD">
            YOUR <span style={{ color: "#7F77DD" }}>RECORD</span>
            <span className="heading-badge heading-badge-green ml-4">ID_OK</span>
          </h1>
          <p
            className="text-sm mt-4 border-l-2 pl-3 max-w-xl font-mono"
            style={{ borderColor: "#7F77DD", color: "#6B6A72" }}
          >
            NODE_ID: {user.id}
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent p-3 rounded-xl border border-[var(--color-primary)]/30 w-fit">
          <Shield className="w-8 h-8 text-[var(--color-primary)]" />
          <div>
            <div className="text-xs text-[var(--color-muted)] uppercase font-mono">Current Clearance</div>
            <div className="text-lg font-bold text-white">Clearance Lvl {user.level}</div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[var(--color-surface)] border border-[#2A2A35] rounded-xl flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <div>
            <div className="text-xs text-[var(--color-muted)] uppercase">Global Rank</div>
            <div className="text-lg font-bold text-white">{globalRank ? `#${globalRank}` : "Unranked"}</div>
          </div>
        </div>
        <div className="p-4 bg-[var(--color-surface)] border border-[#2A2A35] rounded-xl flex items-center space-x-3">
          <Flame className="w-8 h-8 text-orange-500" />
          <div>
            <div className="text-xs text-[var(--color-muted)] uppercase">Active Streak</div>
            <div className="text-lg font-bold text-white">{user.streak} Days</div>
          </div>
        </div>
        <div className="p-4 bg-[var(--color-surface)] border border-[#2A2A35] rounded-xl flex items-center space-x-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <div className="text-xs text-[var(--color-muted)] uppercase">Missions</div>
            <div className="text-lg font-bold text-white">{completedMissionsCount} Cleared</div>
          </div>
        </div>
        <div className="p-4 bg-[var(--color-surface)] border border-[#2A2A35] rounded-xl flex items-center space-x-3">
          <Cpu className="w-8 h-8 text-[var(--color-primary)]" />
          <div>
            <div className="text-xs text-[var(--color-muted)] uppercase">Badges</div>
            <div className="text-lg font-bold text-white">{user.userBadges.length} Unlocked</div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Badges Grid (Left 2 columns on desktop) */}
        <div className="md:col-span-2 bg-[var(--color-surface)] border border-[#2A2A35] rounded-xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--color-primary)]" /> Badges Database
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            {allBadges.map((badge: any) => {
              const isEarned = earnedBadgesIds.includes(badge.id);
              const BadgeIcon = iconMap[badge.iconName] || Shield;
              return (
                <div 
                  key={badge.id} 
                  className={`p-4 border rounded-xl flex flex-col items-center text-center justify-between transition-all ${
                    isEarned 
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-white' 
                      : 'border-[#2A2A35] bg-[#2A2A35]/20 text-gray-500 opacity-60'
                  }`}
                >
                  <div className="relative mb-2">
                    <BadgeIcon className={`w-10 h-10 ${isEarned ? 'text-[var(--color-primary)] animate-pulse' : 'text-gray-600'}`} />
                    {!isEarned && <Lock className="w-4 h-4 text-gray-600 absolute -bottom-1 -right-1" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">{badge.name}</div>
                    <div className="text-[10px] text-gray-400 mt-1 leading-snug">{badge.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Chart (Right 1 column on desktop) */}
        <div className="bg-[var(--color-surface)] border border-[#2A2A35] rounded-xl p-6 flex flex-col h-[350px] md:h-auto">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--color-primary)]" /> XP Activity History
          </h2>
          <div className="flex-1 w-full min-h-[200px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888780" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888780" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#141416", borderColor: "#2A2A35" }} 
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
