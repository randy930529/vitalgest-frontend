import Image from "next/image";
import { CruzRojaLogo } from "@/app/ui/logos";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white mt-7 dark:bg-gray-800">
      <section className="flex flex-col md:flex-row items-center justify-center md:justify-between md:space-y-0 px-3 sm:px-5">
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
          <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center">
            Checklist de Ambulancia
          </p>
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
