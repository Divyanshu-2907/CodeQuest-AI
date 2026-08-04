"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Trophy, Flame, Shield, ArrowUp } from "lucide-react";

type LeaderboardUser = {
  id: string;
  username: string;
  level: number;
  xp: number;
  streak: number;
};

export default function LeaderboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [callerRank, setCallerRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load leaderboard data.");
        return res.json();
      })
      .then((data) => {
        setLeaderboard(data.leaderboard || []);
        setCallerRank(data.callerRank || null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-[var(--color-primary)]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-sm tracking-wider uppercase animate-pulse">Syncing Leaderboard Grid...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center max-w-md mx-auto my-12">
        <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">SYSTEM ERROR</h2>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-10 mt-4">
        <div className="heading-tag mb-3">
          // GLOBAL_RANKINGS
        </div>
        <h1 className="city-heading text-4xl md:text-5xl" data-text="LEADERBOARD">
          LEADERBOARD
          <span className="heading-badge heading-badge-green ml-4">LIVE</span>
        </h1>
        <p
          className="text-sm mt-4 border-l-2 pl-3 max-w-xl"
          style={{ borderColor: "#7F77DD", color: "#6B6A72" }}
        >
          Top 100 neural networks in the city grid. Highlighted rows mark your active node.
        </p>
      </div>

      {callerRank && (
        <div className="mb-6 p-4 glass-panel border border-[var(--color-primary)]/30 rounded-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-[var(--color-primary)]" />
            <div>
              <div className="text-xs text-[#AFA9EC] uppercase font-mono">Your Rank</div>
              <div className="text-lg font-bold text-white"># {callerRank}</div>
            </div>
          </div>
          <div className="text-xs font-mono text-[var(--color-primary)] flex items-center">
            <ArrowUp className="w-3.5 h-3.5 mr-1" /> CLIMBING GRID
          </div>
        </div>
      )}

      <div className="bg-[var(--color-surface)] border border-[#2A2A35] rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A35] bg-[#2A2A35]/30 text-xs font-bold text-[var(--color-muted)] tracking-wider">
                <th className="p-4 w-16">RANK</th>
                <th className="p-4">AGENT</th>
                <th className="p-4 text-center">LEVEL</th>
                <th className="p-4 text-right">XP</th>
                <th className="p-4 text-center">STREAK</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => {
                const isCurrentUser = user && user.id === player.id;
                const rank = index + 1;
                return (
                  <tr 
                    key={player.id} 
                    className={`border-b border-[#2A2A35]/50 transition-colors ${
                      isCurrentUser 
                        ? 'bg-[var(--color-primary)]/10 text-white' 
                        : 'hover:bg-[#2A2A35]/20 text-gray-300'
                    }`}
                  >
                    <td className="p-4 font-bold text-sm">
                      {rank === 1 && "🥇"}
                      {rank === 2 && "🥈"}
                      {rank === 3 && "🥉"}
                      {rank > 3 && `#${rank}`}
                    </td>
                    <td className="p-4 font-semibold flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-sm bg-[var(--color-primary)]/20 flex items-center justify-center font-bold text-[var(--color-primary)] shadow-md text-xs border border-[var(--color-primary)]/30">
                        {player.username?.substring(0, 2).toUpperCase() || "AG"}
                      </div>
                      <span>{player.username || "Anonymous Agent"}</span>
                    </td>
                    <td className="p-4 text-center font-mono text-sm">{player.level}</td>
                    <td className="p-4 text-right font-mono font-bold text-sm text-[var(--color-primary)]">
                      {player.xp.toLocaleString()} XP
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Flame className={`w-4 h-4 ${player.streak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
                        <span className="font-mono text-sm font-semibold">{player.streak}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-gray-500 italic">No nodes ranked yet. Complete a mission to take the lead!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
