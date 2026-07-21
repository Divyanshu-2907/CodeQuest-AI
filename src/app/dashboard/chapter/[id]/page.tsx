import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Play, Lock, CheckCircle, ArrowLeft } from "lucide-react";

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    redirect("/login");
  }

  const { id } = await params;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!dbUser) {
    redirect("/dashboard");
  }

  const chapter = await prisma.chapter.findUnique({
    where: { id },
    include: {
      missions: {
        orderBy: { title: "asc" }
      }
    }
  });

  if (!chapter) {
    return <div className="p-8 text-white">District not found.</div>;
  }

  // Find user missions to determine status
  const userMissions = await prisma.userMission.findMany({
    where: { userId: dbUser.id }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href="/dashboard/city" className="inline-flex items-center text-sm text-[var(--color-primary)] hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pause Map
      </Link>

      <header className="border-b border-[#2A2A35] pb-6">
        <div className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase mb-1">
          DISTRICT 0{chapter.number}
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
          {chapter.title}
        </h1>
        <p className="text-lg text-[var(--color-muted)] mt-4 leading-relaxed max-w-3xl">
          {chapter.lore}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapter.missions.map((mission) => {
          const userMission = userMissions.find(um => um.missionId === mission.id);
          const isCompleted = userMission?.status === "COMPLETED";
          const isActive = userMission?.status === "ACTIVE";
          
          const isPlayable = isActive || isCompleted || mission.title.includes("1") || userMissions.length === 0;

          const isBoss = mission.type === "BOSS";
          const isProLocked = isBoss && !dbUser.isPro;

          return (
            <div 
              key={mission.id}
              className={`p-6 border rounded-xl flex flex-col justify-between transition-all ${
                isProLocked
                  ? "border-yellow-500/20 bg-yellow-500/5 opacity-80"
                  : isCompleted
                  ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 text-white"
                  : isPlayable
                  ? "border-[#2A2A35] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 text-white"
                  : "border-[#2A2A35]/50 bg-[#2A2A35]/10 text-gray-500 cursor-not-allowed opacity-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    isBoss 
                      ? "bg-red-500/20 text-red-400" 
                      : "bg-[#2A2A35] text-[var(--color-muted)]"
                  }`}>
                    {mission.type} MISSION
                  </span>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {isProLocked && (
                    <span className="text-[10px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded tracking-widest uppercase">
                      PRO ONLY
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{mission.title}</h3>
                <p className="text-sm text-[var(--color-muted)] mb-6 line-clamp-2">{mission.briefing}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2A2A35]/50">
                <span className="text-xs font-mono text-yellow-400 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1" /> +{mission.xpReward} XP
                </span>

                {isProLocked ? (
                  <Link 
                    href="/dashboard/upgrade"
                    className="py-2 px-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded text-xs transition-colors"
                  >
                    GO PRO
                  </Link>
                ) : isPlayable ? (
                  <Link 
                    href={`/dashboard/mission/${mission.id}`}
                    className={`py-2 px-4 font-bold rounded text-xs flex items-center gap-1 transition-colors ${
                      isCompleted 
                        ? "bg-[#2A2A35] hover:bg-[#2A2A35]/80 text-white" 
                        : "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white shadow-md shadow-[var(--color-primary)]/20"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" fill="currentColor" /> {isCompleted ? "REPLAY" : "ENGAGE"}
                  </Link>
                ) : (
                  <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> LOCKED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
