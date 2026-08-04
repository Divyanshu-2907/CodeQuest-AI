import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MissionRoomClient from "@/components/MissionRoomClient";

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      chapter: true,
      userMissions: {
        where: {
          userId: session.user.id
        }
      }
    }
  });

  if (!mission || !user) {
    return <div className="p-8 text-white">Mission or user not found.</div>;
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#0A0A0E]">
      <MissionRoomClient 
        mission={mission} 
        userMissionStatus={mission.userMissions[0]?.status || "LOCKED"} 
        isPro={user.isPro} 
      />
    </div>
  );
}
