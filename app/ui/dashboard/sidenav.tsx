import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { VitalGestLogo } from "@/app/ui/logos";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-2 py-2 md:px-3 md:py-8">
      <Link
        className="mb-3 hidden min-h-[110px] items-center justify-center rounded-[22px] bg-transparent p-4 md:flex md:h-[110px]"
        href="/"
      >
        <div className="w-32 md:w-40">
          <VitalGestLogo />
        </div>
      </Link>
      <div className="isolate flex grow flex-row flex-nowrap items-center justify-between rounded-[24px] border border-white/70 bg-white/90 p-2 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm md:flex-col md:items-stretch md:justify-start md:gap-0 md:space-y-2 md:space-x-0">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] md:block"></div>
      </div>
    </div>
  );
}
