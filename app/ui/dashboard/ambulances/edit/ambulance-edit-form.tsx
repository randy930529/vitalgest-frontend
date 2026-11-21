"use client";

import { useActionState } from "react";
import { notFound, useRouter } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { AmbulanceType, DelegationType } from "@/app/lib/definitions";
import { updateAmbulance } from "@/app/lib/actions/ambulance";
import { AmbulanceState } from "@/app/lib/config/stateConfigs";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { FormButtons } from "@/app/ui/button";
import { FormInput } from "@/app/ui/dashboard/form-fields";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";

const customFormInput = {
  number: { type: "text", title: "Número", required: true },
  brand: { type: "text", title: "Marca", required: true },
  model: { type: "text", title: "Modelo", required: true },
};

export default function AmbulanceEditForm({
  data,
}: {
  data: [AmbulanceType | undefined, DelegationType[]];
}) {
  // (Component) Formulario de ambulancia - [CSR]

  const router = useRouter();
  const [ambulance, delegations] = data;

  if (!ambulance) {
    notFound();
  }

  const initialState: AmbulanceState = { errors: {}, message: null };
  const updateAmbulanceWithId = updateAmbulance.bind(null, ambulance?.id || "");
  const [state, formAction, isLoading] = useActionState(
    updateAmbulanceWithId,
    initialState,
  );

  useFormNotifications({
    state,
  });

  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {ambulance.number}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {ambulance.brand} - {ambulance.model}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form className="w-3/5" action={formAction}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            {Object.keys(customFormInput).map((name) => (
              <FormInput
                key={name}
                name={name}
                initialValue={ambulance[name as "number" | "brand" | "model"]}
                errors={state.errors?.[name as "number" | "brand" | "model"]}
                customFormInput={customFormInput}
              />
            ))}

            {delegations && (
              <DelegationsSelector
                delegations={delegations}
                defaultValue={ambulance.delegation?.id || ""}
                errors={state.errors?.delegationId}
              />
            )}
          </div>
          <FormButtons
            onCancel={() => router.push("/dashboard/ambulances")}
            submitText="Guardar"
            cancelText="Regresar"
            isLoading={isLoading}
          />
        </form>
      </div>
    </main>
  );
}
