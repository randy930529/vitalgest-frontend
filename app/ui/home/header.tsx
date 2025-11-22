import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import { VitalGestLogo } from "@/app/ui/logos";
import NavBar from "@/app/ui/dashboard/nav-bar";
import { StatCard } from "../dashboard/cards";
import {
  BuildingOffice2Icon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default async function Header() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <header className="relative isolate overflow-hidden bg-gray-900 py-6 sm:py-8">
      <div className="flex justify-between items-center rounded-lg p-4 max-h-24 overflow-y-hidden">
        <div className="w-32 text-white md:w-40">
          <VitalGestLogo />
        </div>
        <NavBar user={session.user} />
      </div>
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            VitalGest
          </h1>
          <p className="mt-4 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A ea
            consectetur aspernatur nam nulla vel placeat eveniet obcaecati.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          {/* <dl className="mt-8 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Offices worldwide</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">
                12
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">
                Full-time colleagues
              </dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">
                300+
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Hours per week</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">
                40
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Paid time off</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">
                Unlimited
              </dd>
            </div>
          </dl> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Delegación"
              value={"1"}
              icon={BuildingOffice2Icon}
              color="bg-green-500"
            />
            <StatCard
              title="Guardia Activa"
              value={"1"}
              icon={ShieldCheckIcon}
              color="bg-purple-500"
            />
            <StatCard
              title="Ambulancia"
              value={"2"}
              icon={TruckIcon}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
