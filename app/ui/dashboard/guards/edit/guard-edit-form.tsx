"use client";

import { useActionState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  AmbulanceType,
  CustomOptions,
  DelegationType,
  GuardType,
  ShiftType,
} from "@/app/lib/definitions";
import { GuardState, updateGuard } from "@/app/lib/actions/guard";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { Button } from "@/app/ui/button";
import AmbulanceAssignForm from "@/app/ui/dashboard/guards/create/ambulance-assign-form";
import { FormDatepicker, FormSelect } from "@/app/ui/dashboard/form-fields";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";
import { CardsGroup, CardShift, CardWrapper } from "@/app/ui/cards";
import { GuardStateShow } from "@/app/ui/dashboard/guards/guards-table";

export default function GuardEditForm({
  data,
}: {
  data: [
    GuardType | undefined,
    ShiftType[],
    AmbulanceType[],
    DelegationType[],
    [CustomOptions[], CustomOptions[], CustomOptions[]]
  ];
}) {
  // (Component) Formulario de edicion de guardias - [CSR]

  const [
    guard,
    shifts,
    ambulances,
    delegations,
    [guardChiefs, drivers, paramedicals],
  ] = data;
  const customAmbulances = ambulances.map<CustomOptions>(({ id, number }) => ({
    id,
    label: number,
    value: id,
  }));

  if (!guard) {
    notFound();
  }

  const initialState: GuardState = { errors: {}, message: null };
  const updateDelegationWithId = updateGuard.bind(null, guard?.id || "");
  const [state, formAction] = useActionState(
    updateDelegationWithId,
    initialState
  );

  const date = formatDateToDDMMYYYY(guard?.date || "");
  const datePicker = new Date(guard?.date).toISOString().split("T")[0];
  const dateStart = new Date().toISOString().split("T")[0];

  useEffect(() => {
    state.message && toast.success(state.message);
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

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
        <form action={formAction} className="w-3/5">
          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <DelegationsSelector
              delegations={delegations}
              defaultValue={guard.delegation?.id}
              errors={state.errors?.delegationId}
            />

            <FormSelect
              key="guardChief"
              name="guardChief"
              title="Jefe de Guardia"
              options={[
                { id: "", label: "Seleccione Jefe de Guardia", value: "" },
                ...guardChiefs,
              ]}
              defaultValue={guard.guardChief?.id}
              errors={state.errors?.guardChief}
              required
            />

            <div className="relative max-w-sm">
              <FormDatepicker
                name="date"
                type="date"
                title="Fecha"
                initialDate={datePicker}
                dateStart={dateStart}
                errors={state.errors?.date}
                required
              />
            </div>
          </div>
          <div className="absolute w-3/5 bottom-4 flex justify-end gap-4">
            <Link
              href="/dashboard/guards"
              className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Regresar
            </Link>
            <Button
              type="submit"
              className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Guardar
            </Button>
          </div>
        </form>
        {guard && (
          <div className="w-3/5 py-4">
            <div className="mb-4">
              <p>Estado</p>
              <GuardStateShow state={guard.state} />
            </div>
            <AmbulanceAssignForm
              guardId={guard.id}
              ambulances={customAmbulances}
              drivers={drivers}
              paramedicals={paramedicals}
            />
          </div>
        )}
        <div className="w-3/5 py-4">
          <CardsGroup>
            <h3 className="text-base font-bold mb-2">Turnos Asignados</h3>
            <ul className="flex gap-2 pb-3">
              {shifts.map((shift) => (
                <li key={`shift-${shift.id}`}>
                  <CardWrapper key={`card-container-${shift.id}`} controllers>
                    <CardShift key={`card-${shift.id}`} shift={shift} />
                  </CardWrapper>
                </li>
              ))}
            </ul>
          </CardsGroup>
        </div>
      </div>
    </main>
  );
}
