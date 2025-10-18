"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AmbulanceType } from "@/app/lib/definitions";
import { AmbulanceState, updateAmbulance } from "@/app/lib/actions/ambulance";
import { Button } from "@/app/ui/button";
import { FormInput } from "@/app/ui/dashboard/form-input";

const customFormInput = {
  numero: { type: "text", title: "Número", required: true },
  marca: { type: "text", title: "Marca", required: true },
  modelo: { type: "text", title: "Modelo", required: true },
};

export default function AmbulanceEditForm({
  ambulance,
}: {
  ambulance: AmbulanceType | undefined;
}) {
  // <div>(Component) Formulario de ambulancia - [CSR]</div>

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
    <div className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form className="w-3/5" action={formAction}>
          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            {Object.keys(customFormInput).map((name) => (
              <FormInput
                key={name}
                name={name}
                initialValue={
                  ambulance?.[name as "numero" | "marca" | "modelo"]
                }
                errors={state.errors?.[name as "numero" | "marca" | "modelo"]}
                customFormInput={customFormInput}
              />
            ))}
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
    </div>
  );
}
