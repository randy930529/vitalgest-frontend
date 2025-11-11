"use client";

import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { DelegationType } from "@/app/lib/definitions";
import { AmbulanceState, createAmbulance } from "@/app/lib/actions/ambulance";
import { Button } from "@/app/ui/button";
import { FormInput } from "@/app/ui/dashboard/form-fields";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";

const customFormInput = {
  number: { type: "text", title: "Número", required: true },
  brand: { type: "text", title: "Marca", required: true },
  model: { type: "text", title: "Modelo", required: true },
};

export default function AmbulanceForm({
  delegations,
  onClose,
}: {
  delegations?: DelegationType[];
  onClose?: () => void;
}) {
  // (Component) Formulario de Ambulancia - [CSR]

  const initialState: AmbulanceState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createAmbulance, initialState);

  useEffect(() => {
    state.message && toast.success(state.message);
    state.message && onClose && onClose();
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  return (
    <form action={formAction}>
      <div className="grid gap-4 mb-4 sm:grid-cols-1">
        {Object.keys(customFormInput).map((name) => (
          <FormInput
            key={name}
            name={name}
            errors={state.errors?.[name as "number" | "brand" | "model"]}
            customFormInput={customFormInput}
          />
        ))}

        {delegations && (
          <DelegationsSelector
            delegations={delegations}
            errors={state.errors?.delegationId}
          />
        )}
      </div>
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
    </form>
  );
}
