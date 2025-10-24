import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { verifySession } from "@/app/lib/dal";
import SectionHeader from "@/app/ui/dashboard/section-header";
import NavBar from "@/app/ui/dashboard/nav-bar";
import SideNav from "@/app/ui/dashboard/sidenav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  const userRole = session?.user?.role;

  if (
    session?.isAuth &&
    (userRole === "admin" || userRole === "general_admin")
  ) {
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <aside className="w-full flex-none md:w-64">
          <SideNav />
        </aside>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <header className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <Toaster />
              <SectionHeader />
              <NavBar user={session.user} />
            </header>
            {children}
          </div>
        </div>
      </div>
    );
  } else if (
    session?.isAuth &&
    ["paramedical", "vehicle_operator", "head_guard"].includes(userRole)
  ) {
    redirect("/");
  } else {
    redirect("/login");
  }
}
