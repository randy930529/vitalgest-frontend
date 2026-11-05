import { Suspense } from "react";
import { UserType } from "@/app/lib/definitions";
import { HeaderStats } from "@/app/ui/home/stast-home";
import HeaderStatsSkeleton from "@/app/ui/components/skeletons";

export default async function Header({ user }: { user: UserType }) {
  return (
    <section className="relative isolate px-3 sm:px-5 md:gap-8" role="banner">
      <Suspense fallback={<HeaderStatsSkeleton />}>
        <HeaderStats user={user} />
      </Suspense>
    </section>
  );
}
