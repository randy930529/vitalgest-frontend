"use client";

import { createDelegation, DelegationState } from "@/app/lib/actions";
import { CustomMxState, CustomOptions } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { InlineErrors } from "@/app/ui/custom-errors";
import { useActionState, useEffect, useState } from "react";

export default function DelegationForm({
  customMxStates,
  onClose,
}: {
  customMxStates: CustomMxState[];
  onClose?: () => void;
}) {
  // <div>(Component) Formulario de delegacion - [CSR]</div>

  const initialState: DelegationState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createDelegation, initialState);

  const [mxStateId, setmxStateId] = useState(0);

  const [customMunicipalities, setCustomMunicipalities] = useState<
    CustomOptions[]
  >([]);

  useEffect(() => {
    console.log("Cambio algo", mxStateId);
    const municipalities =
      customMxStates.find(({ id }) => id === mxStateId)?.municipalities || [];
    setCustomMunicipalities(municipalities);
  }, [mxStateId]);

  useEffect(() => {
    state.message && onClose && onClose();
  }, [state.message]);

  const handleOption = (name: string, id: string) => {
    console.log(`Options... ${name} ${id}`);
    setmxStateId(Number(id));
  };

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
            htmlFor="role"
            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Estado
          </label>
          <select
            id="state"
            name="state"
            defaultValue={""}
            onChange={(e) => {
              handleOption(e.target.name, e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          >
            <option key={"state-select"} value="">
              Seleccione el Estado
            </option>
            {customMxStates.map((state) => (
              <option key={state.id} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {state.errors?.state && (
            <InlineErrors
              key="state-error"
              errorId="state-error"
              errors={state.errors?.state}
            />
          )}
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
            disabled={!mxStateId}
          >
            <option key={"state-select"} value="">
              {`Seleccione ${!mxStateId ? "un Estado" : "el Municipio"}`}
            </option>
            {customMunicipalities.map((state) => (
              <option key={state.id} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {state.errors?.municipality && (
            <InlineErrors
              key="municipality-error"
              errorId="municipality-error"
              errors={state.errors?.municipality}
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
