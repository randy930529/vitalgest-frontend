"use client";

import { useActionState, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  CustomMxState,
  CustomOptions,
  DelegationType,
} from "@/app/lib/definitions";
import { updateDelegation } from "@/app/lib/actions/delegation";
import { DelegationState } from "@/app/lib/config/stateConfigs";
import { FormButtons } from "@/app/ui/button";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { getMunicipalitiesOfState } from "@/app/lib/utils";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";

export default function DelegationEditForm({
  data,
}: {
  data: [DelegationType | undefined, CustomMxState[]];
}) {
  // (Component) Formulario de delegación - [CSR]
  const router = useRouter();
  const [delegation, customMxStates] = data;

  if (!delegation) {
    notFound();
  }

  const initialState: DelegationState = { errors: {}, message: null };
  const updateDelegationWithId = updateDelegation.bind(
    null,
    delegation?.id || "",
  );
  const [state, formAction, isLoading] = useActionState(
    updateDelegationWithId,
    initialState,
  );

  const currentMunicipality = `${delegation.municipality.id}-${delegation.municipality.name}`;
  const currentMxState: string =
    customMxStates.find(
      (mxState) =>
        !!mxState.municipalities?.find(
          (municipality) => municipality.value === currentMunicipality,
        ),
    )?.value || "";

  const [mxStateId, setMxStateId] = useState(currentMxState);
  const [customMunicipalities, setCustomMunicipalities] = useState<
    CustomOptions[]
  >(getMunicipalitiesOfState(mxStateId, customMxStates));

  useFormNotifications({
    state,
  });

  function handleOption(name: string, value: string) {
    setMxStateId(value);
  }

  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {delegation.name}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {delegation?.municipality.name}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form action={formAction}>
          <input
            type="text"
            name="name"
            className="hidden"
            defaultValue={delegation.name}
          />
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
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
              defaultValue={`${delegation.municipality.id}-${delegation.municipality.name}`}
              errors={state.errors?.municipality}
              required
              disabled={!mxStateId}
            />
          </div>
          <FormButtons
            onCancel={() => router.push("/dashboard/delegations")}
            submitText="Guardar"
            cancelText="Regresar"
            isLoading={isLoading}
          />
        </form>
      </div>
    </main>
  );
}
