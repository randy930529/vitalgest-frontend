"use client";

import { useActionState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import toast from "react-hot-toast";
import { ShiftType } from "@/app/lib/definitions";
import {
  ChecklistSuppliesState,
  createChecklistSupplies,
} from "@/app/lib/actions/checklist";
import { Button } from "@/app/ui/button";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { Timer } from "@/app/ui/checklists/ambulances/create/checklist-ambulance-form";

export default function ChecklistSuppliesForm({
  data,
}: {
  data: ShiftType | undefined;
}) {
  // (Component) Formulario de Checklist de Insumos - [CSR]

  if (!data) {
    notFound();
  }

  const { guard, ambulance, paramedical } = data;

  const guardShif = {
    id: guard.guardChief?.id || "000",
    name: guard.guardChief?.name || "Nombre",
    lastname: guard.guardChief?.lastname || "Apellidos",
    getFullName() {
      return `${this.name} ${this.lastname}`;
    },
  };
  const initialState: ChecklistSuppliesState = { errors: {}, message: null };
  const [state, formAction] = useActionState(
    createChecklistSupplies,
    initialState
  );
  console.log(state);

  useEffect(() => {
    if (state.message && state.checklist) {
      toast.success(state.message);
      redirect(
        `/checklists/${guard.id}/supplies/${state.checklist.id}/edit?step=1`
      );
    }
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.forEach((error: string) => toast.error(error));
  }, [state.errors?.success]);

  return (
    <section className="flex md:flex-row items-center justify-center md:justify-between md:space-y-0 p-4 relative shadow-md sm:rounded-lg overflow-hidden">
      <form className="w-full" action={formAction}>
        <input
          type="text"
          name="shift"
          defaultValue={data.id}
          className="hidden"
        />
        <div className="grid gap-4 sm: mb-4 sm:grid-flow-row sm:grid-cols-3">
          <p className="font-semibold text-center md:ms-6">
            Ambulancia: <span className="font-normal">{ambulance.number}</span>
          </p>
          <div className="flex flex-col items-center">
            <p className="font-semibold text-center">
              Fecha:
              <span className="ms-1 font-normal">
                {formatDateToDDMMYYYY(guard.date)}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="flex justify-center gap-1 w-3/5 font-semibold md:justify-start">
              <div>Hora:</div>
              <div className="w-1/3">
                <Timer />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <FormSelect
              key={guardShif.id}
              name={guardShif.id}
              title="Jefe de Guardia:"
              options={[
                {
                  id: guardShif.id,
                  label: guardShif.getFullName(),
                  value: guardShif.id,
                },
              ]}
              defaultValue={guardShif.id}
            />
            <FormSelect
              key={paramedical.id}
              name={paramedical.id}
              title="TUM:"
              options={[
                {
                  id: paramedical.id,
                  label: `${paramedical.name} ${paramedical.lastname}`,
                  value: paramedical.id,
                },
              ]}
              defaultValue={paramedical.id}
            />
          </div>
          <Button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800 sm:max-w-fit max-h-10 sm:col-span-2 sm:place-self-center"
          >
            Comenzar revisión
          </Button>
        </div>
      </form>
    </section>
  );
}
