import Image from "next/image";
import { UserType } from "@/app/lib/definitions";
import { VitalGestLogo } from "@/app/ui/logos";
import NavBar from "@/app/ui/dashboard/nav-bar";
import { HeaderStats } from "@/app/ui/home/stast-home";

export default async function Header({ user }: { user: UserType }) {
  const userRole = user.role;
  const isAdmin = userRole === "admin" || userRole === "general_admin";

  return (
    <header className="relative isolate overflow-hidden bg-gray-900 py-6 sm:py-8">
      <div className="flex justify-center items-center rounded-lg bg-white px-8 max-h-16 md:justify-between">
        <div className="hidden w-32 text-white pt-4 md:w-40 overflow-y-hidden md:block">
          <VitalGestLogo />
        </div>
        <div className="mr-8">
          <NavBar user={user} showCog={isAdmin} />
        </div>
      </div>
      <Image
        src={"/images/image-banner.jpg"}
        width={2830}
        height={1500}
        className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
        alt="Grupo de personas de la Cruz Roja Mexicana, reunidos frente a una ambulancia llevando uniformes o chalecos con el símbolo de la Cruz Roja."
      />
      <div
        aria-hidden="true"
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        ></div>
      </div>
      <div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-112 sm:ml-16 sm:translate-x-0"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        ></div>
      </div>
      <div className="mx-auto max-w-7xl mt-4 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            VitalGest
          </h1>
          <p className="mt-4 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            Cruz Roja Mexicana
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <HeaderStats user={user} />
        </div>
      </div>
    </header>
  );
}
