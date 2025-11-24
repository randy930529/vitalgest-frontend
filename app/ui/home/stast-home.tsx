import {
  BuildingOffice2Icon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { UserType } from "@/app/lib/definitions";
import { fetchDelegationById, fetchGuards } from "@/app/lib/data";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { CardAmbulancesGuard, StatCardHome } from "@/app/ui/dashboard/cards";

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
