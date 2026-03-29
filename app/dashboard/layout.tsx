import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import SectionHeader from "@/app/ui/dashboard/section-header";
import NavBar from "@/app/ui/dashboard/nav-bar";
import SideNav from "@/app/ui/dashboard/sidenav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user?.role;

  if (userRole === "admin" || userRole === "general_admin") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.65),_rgba(248,250,252,0.94)_30%,_#f8fafc_60%)] md:flex md:overflow-hidden">
        <aside className="relative z-40 w-full flex-none overflow-visible md:z-auto md:max-w-64 md:border-r md:border-slate-200/70">
          <SideNav />
        </aside>
        <div className="relative z-0 flex-grow px-4 py-4 sm:px-6 sm:py-5 md:overflow-y-auto md:px-8 md:py-8">
          <div className="rounded-[34px] border border-white/80 bg-white/90 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-6">
            <header className="vital-top-gradient mb-6 flex min-h-[110px] flex-col gap-4 rounded-[28px] px-5 py-5 text-white md:flex-row md:items-center md:justify-between md:px-6">
              <SectionHeader />
              <NavBar user={session.user} variant="dark" />
            </header>
            {children}
          </div>
        </div>
      </div>
    );
  } else {
    redirect("/");
  }
}
