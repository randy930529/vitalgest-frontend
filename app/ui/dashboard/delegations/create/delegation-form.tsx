"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createDelegation,
  DelegationState,
} from "@/app/lib/actions/delegation";
import { CustomMxState, CustomOptions } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { getMunicipalitiesOfState } from "@/app/lib/utils";

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

  const [mxStateId, setMxStateId] = useState(0);
  const [customMunicipalities, setCustomMunicipalities] = useState<
    CustomOptions[]
  >([]);

  useEffect(() => {
    setCustomMunicipalities(
      getMunicipalitiesOfState(mxStateId, customMxStates)
    );
  }, [mxStateId]);

  useEffect(() => {
    state.message && toast.success(state.message);
    state.message && onClose && onClose();
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  function handleOption(name: string, value: string) {
    setMxStateId(Number(value));
  }

  return (
    <form action={formAction}>
      <div className="grid gap-4 mb-4 sm:grid-cols-1">
        <FormSelect
          key="state"
          name="state"
          title="Estado"
          defaultValue=""
          options={[
            { id: 0, label: "Seleccione el Estado", value: "" },
            ...customMxStates,
          ]}
          handleOption={handleOption}
          errors={state.errors?.state}
          required
        />

        <FormSelect
          key="municipality"
          name="municipality"
          title="Municipio"
          defaultValue=""
          options={[
            {
              id: 0,
              label: "Seleccione el Municipio",
              value: "",
            },
            ...customMunicipalities,
          ]}
          errors={state.errors?.municipality}
          required
          disabled={!mxStateId}
        />
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
