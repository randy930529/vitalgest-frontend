"use client";

import { redirect } from "next/navigation";
import { CheckListAmbulanceType } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { FormSelect } from "@/app/ui/dashboard/form-fields";

const customFormInput = [
  {
    name: "head_guard",
    title: "Jefe de Guardia:",
    value: null,
    required: true,
  },
  { name: "vehicle_operator", title: "Operador:", value: null, required: true },
  { name: "paramedical", title: "TUM:", value: null, required: true },
];

export default function ChecklistAmbulanceForm({
  data,
}: {
  data: CheckListAmbulanceType | undefined;
}) {
  // (Component) Formulario de Checklist de Ambulancia - [CSR]

  return (
    <section className="flex md:flex-row items-center justify-center md:justify-between md:space-y-0 p-4">
      <form className="w-full" /*action={formAction}*/>
        <div className="grid gap-4 sm: mb-4 sm:grid-flow-row sm:grid-cols-3">
          <p className="ms-6 font-semibold text-center">
            Ambulancia:
            <span className="font-normal"> {"un valor"}</span>
          </p>
          <div className="flex flex-col">
            <p className="ms-6 font-semibold text-center">
              Fecha:
              <span className="font-normal"> {"un valor"}</span>
            </p>
            <p className="font-semibold text-center">
              Km:
              <span className="font-normal"> {"un valor"}</span>
            </p>
          </div>
          <div className="flex flex-col">
            <p className="ms-6 font-semibold text-center">
              Hora:
              <span className="font-normal"> {"un valor"}</span>
            </p>
            <p className="font-semibold text-center">
              Subir Vale de Gas:
              <span className="font-normal"> {"un valor"}</span>
            </p>
          </div>

          <div className="flex flex-col">
            {customFormInput.map(({ name, title, value }) => (
              <FormSelect
                key={name}
                name={name}
                title={title}
                options={[]}
                defaultValue={value || ""}
                errors={[]}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800 sm:max-w-fit max-h-10 sm:col-span-2 sm:place-self-center"
            onClick={() =>
              redirect(`/checklists/ambulances/${"23432-234"}/edit?step=1`)
            }
          >
            Comenzar revisión
          </Button>
        </div>
      </form>
    </section>
  );
}
