import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userMissions: true
    }
  });

  if (!dbUser) {
    redirect("/onboarding");
  }

  const completedMissionIds = dbUser.userMissions
    .filter((um) => um.status === "COMPLETED")
    .map((um) => um.missionId);

  // Find active or next mission
  let activeMission = null;
  const activeUserMission = await prisma.userMission.findFirst({
    where: {
      userId: dbUser.id,
      status: "ACTIVE"
    },
    include: {
      mission: true
    }
  });

  if (activeUserMission) {
    activeMission = activeUserMission.mission;
  } else {
    // Fallback: find first incomplete mission
    const chapters = await prisma.chapter.findMany({
      orderBy: { number: "asc" },
      include: {
        missions: {
          orderBy: { title: "asc" }
        }
      }
    });

    for (const chapter of chapters) {
      for (const mission of chapter.missions) {
        if (!completedMissionIds.includes(mission.id)) {
          activeMission = mission;
          break;
        }
      }
      if (activeMission) break;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-10 mt-4">
        <div className="heading-tag mb-3">
          // SYSTEM_TERMINAL_ROOT
        </div>
        <h1 className="city-heading text-4xl md:text-5xl" data-text="SYSTEM TERMINAL">
          SYSTEM{" "}
          <span style={{ color: "#7F77DD" }}>TERMINAL</span>
          <span className="heading-badge heading-badge-green ml-4">SYS_OK</span>
        </h1>
        <p
          className="text-sm mt-4 border-l-2 pl-3 max-w-xl"
          style={{ borderColor: "#7F77DD", color: "#6B6A72" }}
        >
          Welcome back, Agent. Your connection is secure. Execute algorithms to
          infiltrate corporate mainframes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="border rounded-lg p-5 relative overflow-hidden group"
          style={{ background: "#0F0F12", borderColor: "#1A1A22" }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6B6A72" }}>
            Clearance Level
          </h3>
          <p className="text-4xl font-bold text-white font-mono">
            {dbUser.level}
          </p>
        </div>

        <div 
          className="border rounded-lg p-5 relative overflow-hidden group"
          style={{ background: "#0F0F12", borderColor: "#1A1A22" }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6B6A72" }}>
            Network XP
          </h3>
          <p className="text-4xl font-bold text-white font-mono">
            {dbUser.xp.toLocaleString()}
          </p>
        </div>

        <div 
          className="border rounded-lg p-5 relative overflow-hidden group"
          style={{ background: "#0F0F12", borderColor: "#1A1A22" }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6B6A72" }}>
            Active Streak
          </h3>
          <p className="text-4xl font-bold text-white font-mono">
            {dbUser.streak} <span className="text-xs text-[#6B6A72] font-normal uppercase tracking-wider">days</span>
          </p>
        </div>
      </div>

      {/* Next/Active Mission Box */}
      {activeMission ? (
        <div 
          className="border-2 rounded-lg p-8 relative overflow-hidden circuit-border"
          style={{ 
            background: "#0F0F12", 
            borderColor: "#7F77DD",
            boxShadow: "0 0 32px rgba(127,119,221,0.1)"
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #7F77DD, transparent)" }} />
          
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] text-[#7F77DD] font-bold tracking-widest uppercase">
              ACTIVE NODE COMPROMISE
            </span>
          </div>

          <h3 className="text-xl font-bold mb-3 flex items-center text-white">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] active-dot mr-3" />
            {activeMission.title}
          </h3>
          
          <p className="text-[#9998A3] text-sm leading-relaxed mb-6">
            {activeMission.briefing}
          </p>

          <Link href={`/dashboard/mission/${activeMission.id}`}>
            <button style={{
              background: "#7F77DD",
              color: "#EEEDFE",
              border: "none",
              padding: "10px 24px",
              borderRadius: "6px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontSize: "13px",
              cursor: "pointer",
            }} className="hover:opacity-90 transition-opacity font-sans">
              INITIATE HACK
            </button>
          </Link>
        </div>
      ) : (
        <div 
          className="border rounded-lg p-8 relative overflow-hidden"
          style={{ 
            background: "#0F0F12", 
            borderColor: "#1A1A22",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] text-[#6B6A72] font-bold tracking-widest uppercase">
              NETWORK STATUS
            </span>
          </div>

          <h3 className="text-xl font-bold mb-3 flex items-center text-white">
            ALL SECTORS SECURED
          </h3>
          
          <p className="text-[#9998A3] text-sm leading-relaxed">
            You have successfully completed all available coding missions in Neural City. Stand by for future network grid uploads.
          </p>
        </div>
      )}
    </div>
  );
}
