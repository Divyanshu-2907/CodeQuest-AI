import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";
import UserProfileButton from "@/components/UserProfileButton";

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
    <div className="flex h-screen overflow-hidden" style={{ background: "#080809" }}>

      {/* ── Sidebar ── */}
      <aside
        className="hidden md:flex w-56 flex-col shrink-0 border-r"
        style={{ background: "#0A0A0D", borderColor: "#1A1A22" }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: "#1A1A22" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-xs font-black"
              style={{ background: "rgba(127,119,221,0.2)", color: "#7F77DD", border: "1px solid rgba(127,119,221,0.4)" }}
            >
              CQ
            </div>
            <span
              className="text-base font-black tracking-tighter"
              style={{ color: "#7F77DD" }}
            >
              CODEQUEST_
            </span>
          </div>
          {/* Status line */}
          <div className="flex items-center gap-1.5 mt-3">
            <span
              className="active-dot w-1.5 h-1.5 rounded-full"
              style={{ background: "#1D9E75" }}
            />
            <span className="font-mono text-[10px]" style={{ color: "#1D9E75" }}>
              NEURAL LINK ACTIVE
            </span>
          </div>
        </div>

        {/* Nav */}
        <SidebarNav isPro={isPro} />

        {/* Footer */}
        <div
          className="p-4 border-t flex items-center justify-between gap-4"
          style={{ borderColor: "#1A1A22" }}
        >
          <div className="flex-1 min-w-0">
            <UserProfileButton
              userName={dbUser.username || dbUser.name}
              userEmail={dbUser.email}
              userImage={dbUser.image}
            />
          </div>
          <div className="text-right shrink-0">
            <div
              className="font-mono text-[9px] font-bold tracking-wider"
              style={{ color: isPro ? "#5DCAA5" : "#6B6A72" }}
            >
              {isPro ? "◆ PRO NODE" : "FREE NODE"}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Grid background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(127,119,221,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(127,119,221,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Vignette */}
        <div className="fixed inset-0 pointer-events-none vignette" />

        <div className="relative z-10 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
