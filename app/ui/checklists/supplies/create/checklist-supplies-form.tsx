"use client";

import { useActionState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import toast from "react-hot-toast";
import { ShiftType } from "@/app/lib/definitions";
import { createChecklistSupplies } from "@/app/lib/actions/checklist";
import { ChecklistSuppliesState } from "@/app/lib/config/stateConfigs";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import {
  ChecklistStartButton,
  FormSelect,
} from "@/app/ui/dashboard/form-fields";
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
  const [state, formAction, loading] = useActionState(
    createChecklistSupplies,
    initialState,
  );

  useEffect(() => {
    if (state.message && state.checklist) {
      toast.success(state.message);
      redirect(
        `/checklists/${guard.id}/supplies/${state.checklist.id}/edit?ambulance=${ambulance.id}&step=1`,
      );
    }
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.forEach((error: string) => toast.error(error));
  }, [state.errors?.success]);

  return (
    <section className="relative flex items-center justify-center overflow-hidden p-3 shadow-md sm:rounded-lg sm:p-4 md:flex-row md:justify-between md:space-y-0">
      <form className="w-full" action={formAction}>
        <input
          type="text"
          name="shift"
          defaultValue={data.id}
          className="hidden"
        />
        <div className="grid gap-3 sm:mb-4 sm:grid-flow-row sm:grid-cols-3 sm:gap-4">
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
            <div className="flex w-full justify-center gap-1 font-semibold md:w-auto md:justify-start">
              <div>Hora:</div>
              <div>
                <Timer />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-0.5 sm:gap-0">
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
          <ChecklistStartButton pending={loading}>
            Comenzar revisión
          </ChecklistStartButton>
        </div>
      </form>
    </section>
  );
}
