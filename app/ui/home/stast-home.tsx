import {
  CalendarIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  CheckListAmbulanceType,
  CheckListSupplyType,
  GuardType,
  ShiftType,
} from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import { ChecklistsLinkCard, ResourceCard, ShiftCard } from "@/app/ui/cards";
import { StatCardProps } from "@/app/ui/dashboard/cards";

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
