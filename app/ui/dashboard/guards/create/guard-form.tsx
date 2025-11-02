"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CustomOptions, DelegationType } from "@/app/lib/definitions";
import { createGuard, GuardState } from "@/app/lib/actions/guard";
import { Button } from "@/app/ui/button";
import { InlineErrors } from "@/app/ui/custom-errors";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";
import AmbulanceAssignForm from "./ambulance-assign-form";

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
  const [state, formAction] = useActionState(createGuard, initialState);
  const [runClose, setRunClose] = useState(false);
  console.log(state);

  useEffect(() => {
    state.message && toast.success(state.message);
    setRunClose(!!(state.message && state.guard));
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
            errors={state.errors?.guardChief}
            required
          />

          {/* TODO: Factorizar como un form date reutilizable */}
          <div className="relative max-w-sm">
            <label
              htmlFor="date"
              className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Fecha
              <span className="text-red-600"> *</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="dd/mm/aaaa"
              required
            />
            {state.errors?.date && (
              <InlineErrors
                key="date-error"
                errorId="date-error"
                errors={state.errors?.date}
              />
            )}
          </div>
        </div>
        {!runClose && (
          <div className="w-full flex justify-end gap-4">
            <Button
              type="reset"
              onClick={onClose}
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
              {/* {state.guard.state} */}
              Nueva
            </span>
          </div>
          <AmbulanceAssignForm
            guardId={state.guard.id}
            ambulances={ambulances}
            drivers={drivers}
            paramedicals={paramedicals}
          />
          <div className="w-full flex justify-end gap-4">
            <Button
              type="reset"
              onClick={onClose}
              className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Guardar
            </Button>
          </div>
        </>
      )}
    </>
  );
}
