"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  AmbulanceType,
  CustomOptions,
  DelegationType,
  GuardType,
  ShiftType,
  UserType,
} from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import GuardEditionWizard from "./guard-edition-wizard";

export default function GuardEditForm({
  data,
}: {
  data: [
    GuardType | undefined,
    ShiftType[],
    AmbulanceType[],
    DelegationType[],
    [UserType[], UserType[], UserType[]],
  ];
}) {
  // (Component) Formulario de edicion de guardias - [CSR]

  const router = useRouter();
  const goBack = useSearchParams().get("goBack") || "/dashboard/guards";

  const [
    guard,
    shifts,
    ambulances,
    delegations,
    [guardChiefs, drivers, paramedicals],
  ] = data;

  if (!guard) {
    notFound();
  }

  const customAmbulances = ambulances.map<CustomOptions>(({ id, number }) => ({
    id,
    label: number,
    value: id,
  }));

  const date = formatDateToDDMMYYYY(guard?.date || "");

  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {`Delegación ${guard?.delegation?.name} - ${date}`}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {`${guard.guardChief.name} ${guard.guardChief.name}`}
      </p>
      <div className="flex flex-col relative items-center justify-center md:space-y-0 p-4 pb-14">
        <GuardEditionWizard
          guardChiefs={guardChiefs}
          delegations={delegations}
          ambulances={customAmbulances}
          drivers={drivers}
          paramedicals={paramedicals}
          currentGuard={guard}
          currentShifts={shifts}
          onClose={() => router.push(goBack)}
        />
      </div>
    </main>
  );
}
