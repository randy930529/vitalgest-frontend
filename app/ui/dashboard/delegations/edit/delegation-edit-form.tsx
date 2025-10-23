"use client";

import { useActionState, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  CustomMxState,
  CustomOptions,
  DelegationType,
} from "@/app/lib/definitions";
import {
  DelegationState,
  updateDelegation,
} from "@/app/lib/actions/delegation";
import { Button } from "@/app/ui/button";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { getMunicipalitiesOfState } from "@/app/lib/utils";

export default function DelegationEditForm({
  data,
}: {
  data: [DelegationType | undefined, CustomMxState[]];
}) {
  // (Component) Formulario de delegación - [CSR]

  const [delegation, customMxStates] = data;

  if (!delegation) {
    notFound();
  }

  const initialState: DelegationState = { errors: {}, message: null };
  const updateDelegationWithId = updateDelegation.bind(
    null,
    delegation?.id || ""
  );
  const [state, formAction] = useActionState(
    updateDelegationWithId,
    initialState
  );

  const [mxStateId, setMxStateId] = useState(delegation?.state?.id);
  const [customMunicipalities, setCustomMunicipalities] = useState<
    CustomOptions[]
  >(getMunicipalitiesOfState(mxStateId, customMxStates));

  useEffect(() => {
    setCustomMunicipalities(
      getMunicipalitiesOfState(mxStateId, customMxStates)
    );
  }, [mxStateId]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  function handleOption(name: string, value: string) {
    setMxStateId(Number(value));
  }

  return (
    <section className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {`Delegación ${delegation?.state?.name}, ${delegation?.municipality?.name}`}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {delegation?.municipality.name}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form action={formAction}>
          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <FormSelect
              key="state"
              name="state"
              title="Estado"
              options={[
                { id: 0, label: "Seleccione el Estado", value: "" },
                ...customMxStates,
              ]}
              defaultValue={mxStateId}
              handleOption={handleOption}
              errors={state.errors?.state}
              required
            />

            <FormSelect
              key="municipality"
              name="municipality"
              title="Municipio"
              options={[
                {
                  id: 0,
                  label: "Seleccione el Municipio",
                  value: "",
                },
                ...customMunicipalities,
              ]}
              defaultValue={delegation.municipality.id}
              errors={state.errors?.municipality}
              required
              disabled={!mxStateId}
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/delegations"
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
      </div>
    </section>
  );
}
