import { Suspense } from "react";
import { UserType } from "@/app/lib/definitions";
import { HandRaisedIcon } from "@heroicons/react/24/outline";
import HeaderStatsSkeleton from "@/app/ui/components/skeletons";
import { DelegationInfoCard } from "@/app/ui/dashboard/cards";

export default async function Banner({ user }: { user: UserType }) {
  return (
    <section className="relative isolate px-3 sm:px-5 md:gap-8" role="banner">
      <div className="flex justify-between gap-3 w-full">
        <div className="pt-6 sm:pt-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Hola, {user.name}
            <HandRaisedIcon className="ml-2 inline-block h-6 w-6 -rotate-[30deg] text-orange-400" />
          </h2>
          <p className="tracking-tight text-slate-400">
            Gestiona tus guardias y manten tus checklists al día.
          </p>
        </div>
        <Suspense fallback={<HeaderStatsSkeleton />}>
          <DelegationInfoCard delegationId={user.delegationId} />
        </Suspense>
      </div>
    </section>
  );
}
