"use client";

import { useActionState, useEffect, useState } from "react";
import { notFound, redirect } from "next/navigation";
import toast from "react-hot-toast";
import { ShiftType } from "@/app/lib/definitions";
import { createChecklistAmbulance } from "@/app/lib/actions/checklist";
import { ChecklistState } from "@/app/lib/config/stateConfigs";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import {
  ChecklistStartButton,
  FormInputSingle,
  FormSelect,
  FormUploadFile,
} from "@/app/ui/dashboard/form-fields";

export default function ChecklistAmbulanceForm({
  data,
}: {
  data: ShiftType | undefined;
}) {
  // (Component) Formulario de Checklist de Ambulancia - [CSR]

  if (!data) {
    notFound();
  }

  const { guard, ambulance, driver, paramedical } = data;

  const guardShif = {
    id: guard.guardChief?.id || "000",
    name: guard.guardChief?.name || "Nombre",
    lastname: guard.guardChief?.lastname || "Apellidos",
    getFullName() {
      return `${this.name} ${this.lastname}`;
    },
  };
  const initialState: ChecklistState = { errors: {}, message: null };
  const [state, formAction, loading] = useActionState(
    createChecklistAmbulance,
    initialState,
  );

  useEffect(() => {
    if (state.message && state.checklist) {
      toast.success(state.message);
      redirect(
        `/checklists/${guard.id}/ambulances/${state.checklist.id}/edit?step=1`,
      );
    }
  }, [state.message]);

  useEffect(() => {
    if (state.errors?.gasFile) {
      toast.error("Porfavor seleccione el vale de gas.");
    }
  }, [state.errors?.gasFile]);

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
          <section className="font-semibold text-center md:ms-6">
            Ambulancia: <span className="font-normal">{ambulance.number}</span>
            <input
              type="text"
              name="ambulance"
              defaultValue={ambulance.id}
              className="hidden"
            />
          </section>
          <section className="flex flex-col items-center">
            <p className="font-semibold text-center">
              Fecha:
              <span className="ms-1 font-normal">
                {formatDateToDDMMYYYY(guard.date)}
              </span>
            </p>
            <div className="flex gap-1 flex-wrap items-center justify-center w-full max-w-[120px] sm:items-start sm:justify-start">
              <FormInputSingle
                name="km"
                type="number"
                title="Km: "
                placeholder="0"
                required
              />
            </div>
          </section>
          <section className="flex flex-col items-center md:items-start">
            <div className="flex w-full justify-center gap-1 font-semibold md:w-auto md:justify-start">
              <div>Hora:</div>
              <div>
                <Timer />
              </div>
            </div>
            <div className="flex gap-1 flex-col text-center items-center mt-3 md:text-start">
              <FormUploadFile
                name="gasFile"
                title="Vale de Gas:"
                errors={state.errors?.gasFile}
                acceptFile=".jpg,.jpeg,.png,.pdf"
                required
              />
              <p className="mt-1 w-full text-center text-xs text-gray-500 dark:text-gray-300">
                JPG, PNG o PDF
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-0.5 sm:gap-0">
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
              key={driver.id}
              name={driver.id}
              title="Operador:"
              options={[
                {
                  id: driver.id,
                  label: `${driver.name} ${driver.lastname}`,
                  value: driver.id,
                },
              ]}
              defaultValue={driver.id}
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
          </section>
          <ChecklistStartButton pending={loading}>
            Comenzar revisión
          </ChecklistStartButton>
        </div>
      </form>
    </section>
  );
}

export function Timer() {
  function getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return <span className="font-normal">{time}</span>;
}
