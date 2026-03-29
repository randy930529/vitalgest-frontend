import {
  UsersIcon,
  BuildingOffice2Icon,
  TruckIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { fetchDelegations } from "@/app/lib/data";
import { fetchUsers } from "@/app/lib/data/users";
import { fetchGuards } from "@/app/lib/data/guards";
import { StatCard } from "@/app/ui/dashboard/cards";
import { fetchAmbulances } from "@/app/lib/data/ambulances";

export async function AdminDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/80 p-4 backdrop-blur-sm sm:p-6">
      <div className="pointer-events-none absolute -top-16 right-0 h-44 w-44 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 left-4 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl" />
      {children}
    </main>
  );
}

export async function DashboardStats() {
  const [users, delegations, ambulances, guards] = await Promise.all([
    fetchUsers(),
    fetchDelegations(),
    fetchAmbulances(),
    fetchGuards(),
  ]);

  const totalUsers = users.length;
  const totalDelegations = delegations.length;
  const totalAmbulances = ambulances.length;
  const totalGuardsActive = guards.filter(
    ({ state }) => state === "En curso",
  ).length;

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Usuarios"
        value={totalUsers}
        icon={UsersIcon}
        color="bg-slate-800"
      />
      <StatCard
        title="Delegaciones"
        value={totalDelegations}
        icon={BuildingOffice2Icon}
        color="bg-emerald-600"
      />
      <StatCard
        title="Ambulancias"
        value={totalAmbulances}
        icon={TruckIcon}
        color="bg-rose-500"
      />
      <StatCard
        title="Guardias Activas"
        value={totalGuardsActive}
        icon={ShieldCheckIcon}
        color="bg-sky-600"
      />
    </section>
  );
}

export function DashboardSections() {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <GuardsStats />
      <DelegationStats />
    </section>
  );
}

export function GuardsStats() {
  return (
    <article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <header className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Guardias activas
        </h2>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          2 activas
        </div>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-violet-100 bg-violet-50/80 p-3 text-center">
          <TruckIcon className="mx-auto mb-1 h-5 w-5 text-violet-600" />
          <p className="text-2xl font-semibold text-violet-900">1</p>
          <p className="text-xs font-medium text-violet-700">Ambulancias</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-3 text-center">
          <UsersIcon className="mx-auto mb-1 h-5 w-5 text-sky-600" />
          <p className="text-2xl font-semibold text-sky-900">6</p>
          <p className="text-xs font-medium text-sky-700">Personal</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3 text-center">
          <ShieldCheckIcon className="mx-auto mb-1 h-5 w-5 text-emerald-600" />
          <p className="text-2xl font-semibold text-emerald-900">2</p>
          <p className="text-xs font-medium text-emerald-700">Turnos</p>
        </div>
      </div>

      <div className="space-y-3" aria-label="Lista de guardias activas">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-slate-300 hover:bg-slate-100/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
              <ShieldCheckIcon className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Turno DF434F6</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <CalendarIcon className="h-3 w-3" />
                <span>Hace 2h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              Activa
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-slate-300 hover:bg-slate-100/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
              <ShieldCheckIcon className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Turno DF434F7</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <CalendarIcon className="h-3 w-3" />
                <span>Hace 4h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              Activa
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DelegationStats() {
  return (
    <article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <header className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Delegaciones</h2>
        <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          1 activa
        </div>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-3 text-center">
          <BuildingOffice2Icon className="mx-auto mb-1 h-5 w-5 text-sky-600" />
          <p className="text-2xl font-semibold text-sky-900">1</p>
          <p className="text-xs font-medium text-sky-700">Delegaciones</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-3 text-center">
          <TruckIcon className="mx-auto mb-1 h-5 w-5 text-rose-600" />
          <p className="text-2xl font-semibold text-rose-900">2</p>
          <p className="text-xs font-medium text-rose-700">Ambulancias</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3 text-center">
          <MapPinIcon className="mx-auto mb-1 h-5 w-5 text-emerald-600" />
          <p className="text-2xl font-semibold text-emerald-900">1</p>
          <p className="text-xs font-medium text-emerald-700">Estados</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] p-4 transition hover:border-slate-300">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                <BuildingOffice2Icon className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  Delegacion Ameca, Jalisco
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPinIcon className="h-3 w-3" />
                  <span>Jalisco</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:ml-14">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-rose-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Toyota Corolla
                  </p>
                  <p className="text-xs text-slate-500">Placa: 1234dfde23</p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-rose-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Toyota Corolla
                  </p>
                  <p className="text-xs text-slate-500">Placa: 1234dfde23</p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm sm:ml-14">
            <div className="h-2 flex-1 rounded-full bg-sky-100">
              <div className="h-2 w-full rounded-full bg-sky-600" />
            </div>
            <span className="text-xs font-semibold text-sky-700">
              2 ambulancias
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
