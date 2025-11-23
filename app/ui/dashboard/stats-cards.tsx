import {
  UsersIcon,
  BuildingOffice2Icon,
  TruckIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  fetchAmbulances,
  fetchDelegations,
  fetchGuards,
  fetchUsers,
} from "@/app/lib/data";
import { StatCard } from "@/app/ui/dashboard/cards";

export async function AdminDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  // (Component) Tarjetas con estadísticas clave - [SSR]

  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative sm:rounded-lg overflow-hidden">
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
    ({ state }) => state === "En curso"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Usuarios"
        value={totalUsers}
        icon={UsersIcon}
        color="bg-blue-500"
      />
      <StatCard
        title="Delegaciones"
        value={totalDelegations}
        icon={BuildingOffice2Icon}
        color="bg-green-500"
      />
      <StatCard
        title="Ambulancias"
        value={totalAmbulances}
        icon={TruckIcon}
        color="bg-red-500"
      />
      <StatCard
        title="Guardias Activas"
        value={totalGuardsActive}
        icon={ShieldCheckIcon}
        color="bg-purple-500"
      />
    </div>
  );
}

export function DashboardSections() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GuardsStats />
      <DelegationStats />
    </section>
  );
}

export function GuardsStats() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Guardias Activas</h2>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          2 Activas
        </div>
      </div>

      {/* Mini estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <TruckIcon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-purple-900">1</p>
          <p className="text-xs text-purple-600">Ambulancias</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <UsersIcon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-900">6</p>
          <p className="text-xs text-blue-600">Personal</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <ShieldCheckIcon className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-900">2</p>
          <p className="text-xs text-green-600">Turnos</p>
        </div>
      </div>

      {/* Lista de guardias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Turno DF434F6</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <CalendarIcon className="w-3 h-3" />
                <span>Hace 2h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-green-600">Activa</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Turno DF434F7</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <CalendarIcon className="w-3 h-3" />
                <span>Hace 4h</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-green-600">Activa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DelegationStats() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Delegaciones</h2>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          1 Activas
        </div>
      </div>

      {/* Mini estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <BuildingOffice2Icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-900">1</p>
          <p className="text-xs text-blue-600">Delegaciones</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <TruckIcon className="w-5 h-5 text-red-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-900">2</p>
          <p className="text-xs text-red-600">Ambulancias</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <MapPinIcon className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-900">1</p>
          <p className="text-xs text-green-600">Estados</p>
        </div>
      </div>

      {/* Lista de delegaciones */}
      <div className="space-y-3">
        <div className="p-4 bg-linear-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 rounded-lg transition-all border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BuildingOffice2Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  Delegación Ameca, Jalisco
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPinIcon className="w-3 h-3" />
                  <span>Jalisco</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ambulancias de la delegación */}
          <div className="ml-15 space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Toyota Corolla
                  </p>
                  <p className="text-xs text-gray-500">Placa: 1234dfde23</p>
                </div>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Toyota Corolla
                  </p>
                  <p className="text-xs text-gray-500">Placa: 1234dfde23</p>
                </div>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
          </div>

          {/* Contador de ambulancias */}
          <div className="mt-3 ml-15 flex items-center gap-2 text-sm">
            <div className="flex-1 bg-blue-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-blue-700">
              2 ambulancias
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
