import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardDesktop from "./DashboardDesktop";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  // We still fetch the user to ensure they exist and have a clearance level if needed
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="absolute inset-0">
      <DashboardDesktop />
    </div>
  );
}
