import SideNav from "@/app/ui/dashboard/sidenav";
import SectionHeader from "../ui/dashboard/section-header";
import NavBar from "../ui/dashboard/nav-bar";
import { verifySession } from "../lib/dal";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  const userRole = session?.user?.role;

  if (userRole === "admin" || userRole === "general_admin") {
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <SectionHeader />
              <NavBar session={session} />
            </div>
            {children}
          </section>
        </div>
      </div>
    );
  } else if (
    ["paramedical", "vehicle_operator", "head_guard"].includes(userRole)
  ) {
    redirect("/");
  } else {
    redirect("/login");
  }
}
