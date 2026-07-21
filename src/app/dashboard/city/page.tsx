import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PlayerHUD from "@/components/PlayerHUD";
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
    // If the webhook hasn't fired yet, user might not exist in db
    return <div className="p-8 text-[var(--color-primary)] animate-pulse">Syncing neural link... Please refresh.</div>;
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

  // Handle case where user has 0 XP but chapter 1 needs 0 XP
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative -m-8">
      {/* Background styling to make it feel like a map */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-background)] pointer-events-none" />
      
      <PlayerHUD />
      
      <div className="flex-1 p-8 overflow-y-auto z-10 custom-scrollbar">
        <div className="mb-10 mt-4">
          <div className="heading-tag mb-3">
            // NEURAL_CITY_GRID
          </div>
          <h1
            className="city-heading-glitch text-4xl md:text-5xl"
            data-text="NEURAL CITY"
          >
            NEURAL{" "}
            <span style={{ color: "#7F77DD" }}>CITY</span>
            <span className="heading-badge heading-badge-purple ml-4">GRID_ONLINE</span>
          </h1>
          <p
            className="text-sm mt-4 border-l-2 pl-3 max-w-xl"
            style={{ borderColor: "#7F77DD", color: "#6B6A72" }}
          >
            Select a district to infiltrate. Complete missions to gain XP, level up,
            and unlock new areas of the city grid.
          </p>
        </div>

        <ChapterMap chapters={chaptersWithStatus} isPro={user.isPro} />
      </div>
    </div>
  );
}
