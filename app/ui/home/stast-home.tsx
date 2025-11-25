import {
  BuildingOffice2Icon,
  CalendarIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  CheckListAmbulanceType,
  GuardType,
  ShiftType,
  UserType,
} from "@/app/lib/definitions";
import { fetchDelegationById } from "@/app/lib/data";
import { fetchGuards } from "@/app/lib/data/guards";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { ChecklistsLinkCard, ResourceCard, ShiftCard } from "@/app/ui/cards";
import {
  CardAmbulancesGuard,
  StatCardHome,
  StatCardProps,
} from "@/app/ui/dashboard/cards";

export async function HeaderStats({ user }: { user: UserType }) {
  const delegationId = user.delegationId;
  const [delegation, guards] = await Promise.all([
    fetchDelegationById(delegationId),
    fetchGuards(),
  ]);
  const delegationNameShort =
    delegation?.name?.replace("Delegación ", "") || "";

  const guardOnly = guards.find(
    ({ delegation, guardChief, shifts, state }) =>
      delegation.id === delegationId &&
      state === "En curso" &&
      (guardChief.id === user.id ||
        !!shifts.find(
          ({ driver, paramedical }) =>
            driver.id === user.id || paramedical.id === user.id
        ))
  );

  const [dateGuardOnly, guardChief, ambulance] = guardOnly
    ? [
        formatDateToDDMMYYYY(guardOnly.date),
        guardOnly.guardChief.id === user.id,
        guardOnly.shifts.find(
          ({ driver, paramedical }) =>
            driver.id === user.id || paramedical.id === user.id
        )?.ambulance,
      ]
    : ["", false, undefined];

  const ambulancesInGuard =
    guardOnly?.shifts?.reduce(
      (acc, shift) => acc + shift.ambulance.number + ", ",
      ""
    ) || "";

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <li>
        <StatCardHome
          title="Delegación"
          value={delegationNameShort}
          icon={BuildingOffice2Icon}
          color="bg-green-500"
        />
      </li>
      {guardOnly && (
        <>
          <li>
            <StatCardHome
              title="Guardia Activa"
              value={dateGuardOnly}
              icon={ShieldCheckIcon}
              color="bg-purple-500"
            />
          </li>
          {ambulance && (
            <li>
              <StatCardHome
                title="Ambulancia"
                value={ambulance.number}
                icon={TruckIcon}
                color="bg-red-500"
              />
            </li>
          )}
          {guardChief && (
            <li>
              <CardAmbulancesGuard
                title={"Ambulancias en Turno"}
                value={ambulancesInGuard.trim().slice(0, -1)}
                icon={TruckIcon}
                color="bg-red-100"
              />
            </li>
          )}
        </>
      )}
    </ul>
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
  checklistAmbulance,
  checklistSupplies,
}: {
  guardId: string;
  id: string;
  checklistAmbulance: CheckListAmbulanceType | undefined;
  checklistSupplies: any;
}) {
  return (
    <ol className="flex flex-col justify-between gap-2">
      {checklistAmbulance ? (
        <>
          {checklistAmbulance.notes ? (
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
                id={id}
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
      {checklistSupplies ? (
        <>
          {checklistSupplies.notes ? (
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
                param="edit"
                guardId={guardId}
                id={id}
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
    </ol>
  );
}

export function ShiftStats({
  guardId,
  shifts,
}: {
  guardId: string;
  shifts: ShiftType[];
}) {
  return (
    <ul className="space-y-4">
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
          <li key={"shift-" + id} className="flex gap-4 md:gap-8">
            <ShiftCard
              title={name || ""}
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
              checklistAmbulance={checklistAmbulance}
              checklistSupplies={checklistSupplies}
            />
          </li>
        )
      )}
    </ul>
  );
}

export function GuardStats({ guard }: { guard: GuardType }) {
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
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-gray-800 md:text-xl">
          Detalles de Guardia Actual
        </h2>
        <p className="flex gap-1 items-center bg-green-100 text-green-700 mx-2 px-3 py-1 rounded-full text-sm font-semibold">
          <CalendarIcon className="w-3 h-3" />
          <span>{date}</span>
        </p>
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-8">
        <ResourceStats cardItems={customCard} />
        <ShiftStats guardId={guard.id} shifts={guard.shifts} />
      </div>
    </section>
  );
}
