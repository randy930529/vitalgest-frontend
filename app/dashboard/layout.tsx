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
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <aside className="w-full flex-none md:max-w-44">
          <SideNav user={session.user} />
        </aside>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <header className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <SectionHeader />
              <NavBar user={session.user} />
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
