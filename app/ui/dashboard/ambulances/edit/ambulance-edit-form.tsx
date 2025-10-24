"use client";

import { useActionState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { AmbulanceType, DelegationType } from "@/app/lib/definitions";
import { AmbulanceState, updateAmbulance } from "@/app/lib/actions/ambulance";
import { Button } from "@/app/ui/button";
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

  const [ambulance, delegations] = data;

  if (!ambulance) {
    notFound();
  }

  const initialState: AmbulanceState = { errors: {}, message: null };
  const updateAmbulanceWithId = updateAmbulance.bind(null, ambulance?.id || "");
  const [state, formAction] = useActionState(
    updateAmbulanceWithId,
    initialState
  );

  useEffect(() => {
    state.message && toast.success(state.message) && (state.message = null);
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  return (
    <section className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {ambulance.number}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {ambulance.brand} - {ambulance.model}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form className="w-3/5" action={formAction}>
          <div className="grid gap-4 mb-4 sm:grid-cols-1">
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
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/ambulances"
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
