import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";
import UserProfileButton from "@/components/UserProfileButton";
import { KernelProvider } from "@/os/kernel/KernelProvider";
import NotificationCenter from "@/os/notifications/NotificationCenter";
import SystemHUD from "@/os/hud/SystemHUD";
import AmbientCamera from "@/os/effects/AmbientCamera";
import WindowManager from "@/os/widgets/WindowManager";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!dbUser) {
    // If somehow the user authenticated but isn't in database, redirect to onboarding or signin
    redirect("/login");
  }

  if (!dbUser.onboardingComplete) {
    redirect("/onboarding");
  }

  const isPro = dbUser.isPro || false;

  return (
    <KernelProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: "#080809" }}>

        <AmbientCamera>
          {/* ── Main ── */}
          <main className="flex-1 h-full w-full overflow-y-auto relative custom-scrollbar flex flex-col">
            {/* Grid background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(127,119,221,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(127,119,221,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none vignette" />

            <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col">
              {children}
            </div>
          </main>
        </AmbientCamera>

        {/* Global OS Overlays */}
        <SystemHUD />
        <NotificationCenter />
        <WindowManager />
      </div>
    </KernelProvider>
  );
}
