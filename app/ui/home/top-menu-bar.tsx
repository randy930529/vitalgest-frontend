import { UserType } from "@/app/lib/definitions";
import NavBar from "@/app/ui/dashboard/nav-bar";
import { VitalGestLogo } from "@/app/ui/logos";

export default function TopMenuBar({ user }: { user: UserType }) {
  const isAdmin = user.role === "admin" || user.role === "general_admin";

  return (
    <div className="fixed inset-x-0 top-0 z-[120] border-b border-white/20 bg-gradient-to-r from-slate-800 via-indigo-700 to-blue-700 shadow-[0_24px_55px_-40px_rgba(30,58,138,0.85)]">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-2 sm:h-20 sm:gap-4 sm:px-5">
        <div className="flex h-full items-center gap-2 overflow-hidden py-1 sm:gap-3">
          <div className="rounded-lg bg-white/95 p-0.5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.9)] sm:rounded-xl sm:p-1">
            <div className="relative h-[40px] w-[58px] overflow-hidden sm:h-[60px] sm:w-[84px]">
              <VitalGestLogo width={60} height={60} />
            </div>
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold tracking-[0.08em] text-white/90">
              Centro Operativo Digital
            </p>
            <p className="truncate text-xs text-rose-100/95">
              Guardias y checklist en tiempo real
            </p>
          </div>
        </div>

        <div aria-label="Navegación principal del sistema">
          <NavBar user={user} showCog={isAdmin} variant="dark" />
        </div>
      </div>
    </div>
  );
}
