"use client";

import { createDelegation, DelegationState } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { useActionState } from "react";

export default function DelegationForm({
  customStates,
  onClose,
}: {
  customStates: {
    id: string;
    value: string;
    label: string;
  }[];
  onClose?: () => void;
}) {
  // <div>(Component) Formulario de delegacion - [CSR]</div>

  const initialState: DelegationState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createDelegation, initialState);

  return (
    <form action={formAction}>
      <div className="grid gap-4 mb-4 sm:grid-cols-1">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Delegación Ameca, Jalisco"
            required
          />
        </div>
        <div>
          <label
            htmlFor="role"
            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Estado
          </label>
          <select
            id="state"
            name="state"
            defaultValue={""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option key={"state-select"} value="">
              Seleccione el Estado
            </option>
            {customStates.map((state) => (
              <option key={state.id} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          <div id="rol-error" aria-live="polite" aria-atomic="true">
            {state.errors?.state &&
              state.errors.state.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="role"
            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Municipio
          </label>
          <select
            id="municipality"
            name="municipality"
            defaultValue={""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option key={"state-select"} value="">
              Seleccione el Municipio
            </option>
            {/* {customMunicipalities.map((state) => (
                  <option key={state.id} value={state.value}>
                    {state.label}
                  </option>
                ))} */}
          </select>
          <div id="rol-error" aria-live="polite" aria-atomic="true">
            {state.errors?.municipality &&
              state.errors.municipality.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
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
