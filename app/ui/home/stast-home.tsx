import {
  CalendarIcon,
  HandRaisedIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  CheckListAmbulanceType,
  CheckListSupplyType,
  GuardType,
  ShiftType,
  UserType,
} from "@/app/lib/definitions";
import { fetchDelegationById } from "@/app/lib/data/delegations";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import { ChecklistsLinkCard, ResourceCard, ShiftCard } from "@/app/ui/cards";
import { StatCardHome, StatCardProps } from "@/app/ui/dashboard/cards";

export async function HeaderStats({ user }: { user: UserType }) {
  const delegationId = user.delegationId;
  const [delegation] = await Promise.all([fetchDelegationById(delegationId)]);
  const delegationNameShort =
    delegation?.name?.replace("Delegación ", "") || "";

  return (
    <div className="flex justify-between gap-3 w-full">
      <div className="pt-6 sm:pt-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Hola, {user.name}
          {/* Rota el icono unos 45 grados a la izquierda */}
          <HandRaisedIcon className="ml-2 inline-block h-6 w-6 -rotate-[30deg] text-orange-400" />
        </h2>
        <p className="tracking-tight text-slate-400">
          Gestiona tus guardias y manten tus checklists al día.
        </p>
      </div>
      <StatCardHome
        title={delegationNameShort}
        value="Tu delegación actual"
        icon={MapPinIcon}
        color="bg-emerald-600"
      />
    </div>
  );
}

export function ResourceStats({ cardItems }: { cardItems: StatCardProps[] }) {
  return (
    <ul className="flex md:flex-col gap-4">
      {cardItems.map(({ title, value, icon, color }, index) => (
        <li key={String(index) + value}>
          <ResourceCard title={title} value={value} icon={icon} color={color} />
        </li>
      ))}
    </ul>
  );
}

export function CheckListStats({
  guardId,
  id,
  ambulanceId,
  checklistAmbulance,
  checklistSupplies,
  currentUserRole,
}: {
  guardId: string;
  id: string;
  ambulanceId: string;
  checklistAmbulance: CheckListAmbulanceType | undefined;
  checklistSupplies: CheckListSupplyType | undefined;
  currentUserRole: string;
}) {
  const { accessChlAmbulance, accessChlSupplies } = ROLE_MANAGER;

  return (
    <ol className="flex flex-col justify-between gap-2">
      {accessChlAmbulance(currentUserRole) && (
        <>
          {checklistAmbulance ? (
            <>
              {checklistAmbulance.sign_recipient_path ? (
                <li key={`checklists-link_ambulance-${id}`}>
                  <ChecklistsLinkCard
                    title="CheckList Ambulancia"
                    link=""
                    guardId={guardId}
                    id={id}
                    isChecked
                  />
                </li>
              ) : (
                <li key={`checklists-link_ambulance-${id}`}>
                  <ChecklistsLinkCard
                    title="CheckList Ambulancia"
                    link="ambulances"
                    param="edit?step=1"
                    guardId={guardId}
                    id={checklistAmbulance.id}
                  />
                </li>
              )}
            </>
          ) : (
            <li key={`checklists-link_ambulance-${id}`}>
              <ChecklistsLinkCard
                title="CheckList Ambulancia"
                link="ambulances"
                guardId={guardId}
                id={id}
              />
            </li>
          )}
        </>
      )}

      {accessChlSupplies(currentUserRole) && (
        <>
          {checklistSupplies ? (
            <>
              {checklistSupplies.sign_recipient_path ? (
                <li key={`checklists-link_supplies-${id}`}>
                  <ChecklistsLinkCard
                    title="CheckList Insumos"
                    link=""
                    guardId={guardId}
                    id={id}
                    isChecked
                  />
                </li>
              ) : (
                <li key={`checklists-link_supplies-${id}`}>
                  <ChecklistsLinkCard
                    title="CheckList Insumos"
                    link="supplies"
                    param={`edit?ambulance=${ambulanceId}&step=1`}
                    guardId={guardId}
                    id={checklistSupplies.id}
                  />
                </li>
              )}
            </>
          ) : (
            <li key={`checklists-link_supplies-${id}`}>
              <ChecklistsLinkCard
                title="CheckList Insumos"
                link="supplies"
                guardId={guardId}
                id={id}
              />
            </li>
          )}
        </>
      )}
    </ol>
  );
}

export function ShiftStats({
  guardId,
  shifts,
  currentUserRole,
}: {
  guardId: string;
  shifts: ShiftType[];
  currentUserRole: string;
}) {
  return (
    <ul
      className="space-y-4 md:mx-6"
      aria-label="Turnos de la guardia en curso"
    >
      {shifts.map(
        ({
          id,
          name,
          updatedAt,
          updated_at,
          ambulance,
          driver,
          paramedical,
          checklistAmbulance,
          checklistSupplies,
        }) => (
          <li
            key={"shift-" + id}
            className="flex flex-col gap-3 md:flex-row md:gap-8"
          >
            <ShiftCard
              title={name || "Turno operativo"}
              value={updatedAt || updated_at}
              color="purple"
              icon={ShieldCheckIcon}
              ambulanceNumber={ambulance.number}
              driver={driver}
              paramedical={paramedical}
            />
            <CheckListStats
              guardId={guardId}
              id={id}
              ambulanceId={ambulance.id}
              checklistAmbulance={checklistAmbulance}
              checklistSupplies={checklistSupplies}
              currentUserRole={currentUserRole}
            />
          </li>
        ),
      )}
    </ul>
  );
}

export function GuardStats({
  guard,
  currentUserRole,
}: {
  guard: GuardType;
  currentUserRole: string;
}) {
  const totalShifts = guard.shifts.length;
  const date = formatDateToDDMMYYYY(guard.date);
  const customCard: StatCardProps[] = [
    {
      title: "Ambulancias",
      value: totalShifts,
      icon: TruckIcon,
      color: "purple",
    },
    {
      title: "Personal",
      value: totalShifts * 3,
      icon: UsersIcon,
      color: "blue",
    },
    {
      title: "Turnos",
      value: totalShifts,
      icon: ShieldCheckIcon,
      color: "green",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.25)] sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
          Detalles de Guardia Actual
        </h3>
        <p className="mx-2 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          <CalendarIcon className="h-3 w-3" />
          <span>{date}</span>
        </p>
      </div>

      <div className="flex flex-col justify-between items-center gap-4 md:flex-row md:gap-8">
        <ResourceStats cardItems={customCard} />
        <ShiftStats
          guardId={guard.id}
          shifts={guard.shifts}
          currentUserRole={currentUserRole}
        />
      </div>
    </section>
  );
}
