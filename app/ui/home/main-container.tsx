import { Suspense } from "react";
import { UserType } from "@/app/lib/definitions";
import {
  CurrentGuardSection,
  GuardHistorySection,
} from "@/app/ui/home/home-sections-async";
import {
  CurrentGuardSkeleton,
  GuardHistorySkeleton,
} from "@/app/ui/home/home-skeletons";

export default function MainContainer({ user }: { user: UserType }) {
  return (
    <main
      id="home-main"
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 pb-8 pt-5 sm:px-5 md:gap-8 md:pb-12 md:pt-8"
    >
      <Suspense fallback={<CurrentGuardSkeleton />}>
        <CurrentGuardSection user={user} />
      </Suspense>

      <Suspense fallback={<GuardHistorySkeleton />}>
        <GuardHistorySection user={user} />
      </Suspense>
    </main>
  );
}
