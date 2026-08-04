import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChapterClient from "./ChapterClient";

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

  const userMissions = await prisma.userMission.findMany({
    where: { userId: dbUser.id }
  });

  return (
    <ChapterClient 
      chapter={chapter} 
      userMissions={userMissions} 
      dbUser={dbUser} 
    />
  );
}
