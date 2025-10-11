"use client";

import { useActionState, useEffect } from "react";
import { createGuard, GuardState } from "@/app/lib/actions/guard";
import { CustomOptions } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { InlineErrors } from "@/app/ui/custom-errors";

export default function GuardForm({
  customGuardChief,
  onClose,
}: {
  customGuardChief: CustomOptions[];
  onClose?: () => void;
}) {
  console.log(customGuardChief);
  // <div>(Component) Formulario de guardia - [CSR]</div>

  const initialState: GuardState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createGuard, initialState);
  console.log(state);

  useEffect(() => {
    state.message && onClose && onClose();
  }, [state.message]);

  return (
    <form action={formAction}>
      {state.errors?.success && (
        <InlineErrors
          key="success-error"
          errorId="success-error"
          errors={state.errors?.success}
        />
      )}
      <div className="grid gap-4 mb-4 sm:grid-cols-1">
        <div>
          <label
            htmlFor="guardChief"
            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Jefe de Guardia
          </label>
          <select
            id="guardChief"
            name="guardChief"
            defaultValue={""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option key={"guardChief-select"} value="">
              Seleccione Jefe de Guardia
            </option>
            {customGuardChief.map((guardChief) => (
              <option key={guardChief.id} value={guardChief.value}>
                {guardChief.label}
              </option>
            ))}
          </select>
          {state.errors?.guardChief && (
            <InlineErrors
              key="guardChief-error"
              errorId="guardChief-error"
              errors={state.errors?.guardChief}
            />
          )}
        </div>
        <div className="relative max-w-sm">
          <label
            htmlFor="date"
            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Fecha
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
        <div>
          <label
            htmlFor="ambulance"
            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Ambulancia
          </label>
          <select
            id="ambulance"
            name="ambulance"
            defaultValue={""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option key={"state-select"} value="">
              Seleccione la Ambulance
            </option>
            {customGuardChief.map((guardChief) => (
              <option key={guardChief.id} value={guardChief.value}>
                {guardChief.label}
              </option>
            ))}
          </select>
          {state.errors?.ambulance && (
            <InlineErrors
              key="ambulance-error"
              errorId="ambulance-error"
              errors={state.errors?.ambulance}
            />
          )}
        </div>
      </div>
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
    </form>
  );
}
