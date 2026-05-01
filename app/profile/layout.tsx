import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import TopMenuBar from "@/app/ui/home/top-menu-bar";
import NavBar from "@/app/ui/dashboard/nav-bar";
import SideNav from "@/app/ui/dashboard/sidenav";
import { SectionHeaderOverride } from "@/app/ui/dashboard/section-header";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const isAdmin =
    session.user.role === "admin" || session.user.role === "general_admin";

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.65),_rgba(248,250,252,0.94)_30%,_#f8fafc_60%)] md:flex md:items-start">
        <aside className="relative z-40 w-full flex-none overflow-visible md:sticky md:top-0 md:z-auto md:h-screen md:max-h-screen md:max-w-64 md:overflow-y-auto md:border-r md:border-slate-200/70">
          <SideNav />
        </aside>

        <div className="relative z-0 flex-grow px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-8">
          <div className="rounded-[34px] border border-white/80 bg-white/90 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-6">
            <header className="bg-gradient-to-r from-slate-800 via-indigo-700 to-blue-700 mb-6 flex min-h-[110px] flex-col gap-4 rounded-[28px] px-5 py-5 text-white md:flex-row md:items-center md:justify-between md:px-6">
              <SectionHeaderOverride
                title="Mi Perfil"
                subtitle="Actualiza tu informacion personal y firma digital."
              />
              <NavBar user={session.user} variant="dark" showCog />
            </header>

            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.85),_rgba(241,245,249,1))]">
      <TopMenuBar user={session.user} />
      <main className="mt-16 px-2 pb-4 pt-3 sm:mt-20 sm:px-5 sm:pb-7 sm:pt-4 md:px-8 md:pt-6">
        {children}
      </main>
    </div>
  );
}
