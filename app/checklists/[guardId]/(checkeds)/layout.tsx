import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import { CruzRojaLogo } from "@/app/ui/logos";
import TopMenuBar from "@/app/ui/home/top-menu-bar";
import ChecklistSubTitle from "@/app/checklists/[guardId]/(checkeds)/checklist-subtitle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mt-16 bg-white dark:bg-gray-800 sm:mt-20">
      <TopMenuBar user={session.user} />
      <section className="flex flex-col items-center justify-center px-3 md:flex-row md:justify-between md:space-y-0 sm:px-5">
        <div className="hidden md:block">
          <CruzRojaLogo />
          <h2 className="text-xl md:text-2xl font-bold dark:text-white md:ms-6">
            VitalGest
          </h2>
          <p className="font-semibold text-gray-500 dark:text-gray-400 md:text-center md:ms-6">
            Sistema Administrativo
          </p>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold dark:text-white text-center">
            Coordinación Local de Socorros
          </h2>
          <ChecklistSubTitle />
        </div>
        <Image
          src="/images/ambulancia.svg"
          width={90}
          height={90}
          alt="Escudo rojo con una ambulancia  dentro del escudo vista de perfil lateral."
          priority
        />
      </section>
      {children}
    </main>
  );
}
