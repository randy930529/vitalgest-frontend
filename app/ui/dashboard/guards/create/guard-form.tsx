"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CustomOptions,
  DelegationType,
  GuardType,
  ShiftType,
} from "@/app/lib/definitions";
import { createGuard, updateGuard } from "@/app/lib/actions/guard";
import { GuardState } from "@/app/lib/config/stateConfigs";
import { Button } from "@/app/ui/button";
import { CardsGroup, CardShift, CardWrapper } from "@/app/ui/cards";
import { FormDatepicker, FormSelect } from "@/app/ui/dashboard/form-fields";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";
import AmbulanceAssignForm from "@/app/ui/dashboard/guards/create/ambulance-assign-form";

export default function GuardForm({
  guardChiefs,
  delegations,
  ambulances,
  drivers,
  paramedicals,
  onClose,
}: {
  guardChiefs: CustomOptions[];
  delegations: DelegationType[];
  ambulances: CustomOptions[];
  drivers: CustomOptions[];
  paramedicals: CustomOptions[];
  onClose?: () => void;
}) {
  // (Component) Formulario de guardia - [CSR]

  const initialState: GuardState = { errors: {}, message: null };
  const dateStart = new Date().toISOString().split("T")[0];
  const [state, formAction] = useActionState(createGuard, initialState);
  const [shifts, setShifts] = useState<ShiftType[]>([]);

  useEffect(() => {
    state.message && toast.success(state.message);
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  return (
    <>
      <form action={formAction}>
        <div className="grid gap-4 mb-4 sm:grid-cols-1">
          <DelegationsSelector
            delegations={delegations}
            defaultValue={state.guard?.delegation?.id}
            errors={state.errors?.delegationId}
          />

          <FormSelect
            key={"guardChief" + state.guard?.guardChief?.id}
            name="guardChief"
            title="Jefe de Guardia"
            options={[
              { id: "", label: "Seleccione Jefe de Guardia", value: "" },
              ...guardChiefs,
            ]}
            defaultValue={state.guard?.guardChief?.id}
            errors={state.errors?.guardChief}
            required
          />

          <div className="relative max-w-sm">
            <FormDatepicker
              name="date"
              title="Fecha"
              initialDate={dateStart}
              dateStart={dateStart}
              errors={state.errors?.date}
              required
            />
          </div>
        </div>
        {!(state.message && state.guard) && (
          <div className="w-full flex justify-end gap-4">
            <Button
              type="reset"
              onMouseDown={onClose}
              className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Guardar
            </Button>
          </div>
        )}
      </form>
      {state.guard && (
        <>
          <div className="mb-4">
            <p>Estado</p>
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
              {state.guard.state || "Nueva"}
            </span>
          </div>
          <AmbulanceAssignForm
            guardId={state.guard.id}
            ambulances={ambulances}
            drivers={drivers}
            paramedicals={paramedicals}
            setShifts={setShifts}
          />
          <div className="py-4">
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
          <InitGuardForm
            guard={state.guard}
            onClose={onClose}
            hasShifts={!!shifts.length}
          />
        </>
      )}
    </>
  );
}

function InitGuardForm({
  guard,
  onClose,
  hasShifts,
}: {
  guard: GuardType;
  onClose?: () => void;
  hasShifts?: boolean;
}) {
  const initialState: GuardState = { errors: {}, message: null };
  const updateDelegationWithId = updateGuard.bind(null, guard?.id || "");
  const [state, formAction] = useActionState(
    updateDelegationWithId,
    initialState,
  );

  const datePicker = new Date(guard.date).toISOString().split("T")[0];

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      onClose && onClose();
    }
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  function handleSubmit(formData: FormData) {
    if (hasShifts) {
      formAction(formData);
    } else {
      toast.error("Debe asignar los tunos a la guardia.");
    }
  }

  return (
    <form action={handleSubmit} className="flex justify-end w-full">
      <input
        type="text"
        name="delegation"
        defaultValue={guard.delegation.id}
        className="hidden"
      />
      <input
        type="text"
        name="guardChief"
        defaultValue={guard.guardChief.id}
        className="hidden"
      />
      <input
        type="date"
        name="date"
        defaultValue={datePicker}
        className="hidden"
      />
      <input
        type="text"
        name="state"
        defaultValue="En curso"
        className="hidden"
      />
      <Button
        type="submit"
        className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Iniciar Guardia
      </Button>
    </form>
  );
}
