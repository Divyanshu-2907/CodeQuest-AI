import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChapterMap, { ChapterWithStatus } from "@/components/ChapterMap";

export default async function CityMapPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center font-mono text-[var(--color-primary)] animate-pulse">
        [ SYNCHRONIZING NEURAL LINK... ]
      </div>
    );
  }

  const chapters = await prisma.chapter.findMany({
    orderBy: { number: 'asc' }
  });

  // Calculate status based on XP
  let highestUnlockedIndex = -1;
  for (let i = 0; i < chapters.length; i++) {
    if (user.xp >= chapters[i].unlockXp) {
      highestUnlockedIndex = i;
    } else {
      break;
    }
  }

  if (highestUnlockedIndex === -1 && chapters.length > 0 && user.xp >= chapters[0].unlockXp) {
    highestUnlockedIndex = 0;
  }

  const chaptersWithStatus: ChapterWithStatus[] = chapters.map((chapter, index) => {
    let status: "COMPLETED" | "CURRENT" | "LOCKED" = "LOCKED";
    
    if (index < highestUnlockedIndex) {
      status = "COMPLETED";
    } else if (index === highestUnlockedIndex) {
      status = "CURRENT";
    }

    return {
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      lore: chapter.lore,
      unlockXp: chapter.unlockXp,
      status
    };
  });
  console.log("SERVER LOG: chaptersWithStatus =", chaptersWithStatus);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0E]">
      {/* Targeting Reticles Overlay (HUD aesthetic) */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[var(--color-primary)]/40 pointer-events-none z-20" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[var(--color-primary)]/40 pointer-events-none z-20" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[var(--color-primary)]/40 pointer-events-none z-20" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[var(--color-primary)]/40 pointer-events-none z-20" />
      
      {/* Coordinates / Map Legend */}
      <div className="absolute top-10 left-20 text-[10px] font-mono text-gray-500 uppercase tracking-widest pointer-events-none z-20">
        LAT: 45.9281 // LNG: -12.4920 <br/>
        SECTOR: NEURAL_CITY_GRID
      </div>
      
      <div className="absolute top-10 right-20 text-right text-[10px] font-mono text-gray-500 uppercase tracking-widest pointer-events-none z-20">
        THREAT LEVEL: <span className="text-yellow-500">MODERATE</span> <br/>
        ENCRYPTION: <span className="text-green-500">ACTIVE</span>
      </div>

      <ChapterMap chapters={chaptersWithStatus} isPro={user.isPro} />
    </div>
  );
}
