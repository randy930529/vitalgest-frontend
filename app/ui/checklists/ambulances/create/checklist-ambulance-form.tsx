"use client";

import { useActionState, useEffect, useState } from "react";
import { notFound, redirect } from "next/navigation";
import toast from "react-hot-toast";
import { ShiftType } from "@/app/lib/definitions";
import { ChecklistState, createChecklist } from "@/app/lib/actions/checklist";
import { Button } from "@/app/ui/button";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import {
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
  const [state, formAction] = useActionState(createChecklist, initialState);
  console.log(state);

  useEffect(() => {
    if (state.message && state.checklist) {
      toast.success(state.message);
      redirect(`/checklists/ambulances/${state.checklist.id}/edit?step=1`);
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
            <input
              type="text"
              name="ambulance"
              defaultValue={ambulance.id}
              className="hidden"
            />
          </p>
          <div className="flex flex-col items-center">
            <p className="font-semibold text-center">
              Fecha:
              <span className="ms-1 font-normal">
                {formatDateToDDMMYYYY(guard.date)}
              </span>
            </p>
            <div className="flex w-1/3 gap-2">
              <FormInputSingle
                name="km"
                type="number"
                title="Km: "
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="flex justify-center gap-1 w-3/5 font-semibold md:justify-start">
              <div>Hora:</div>
              <div className="w-1/3">
                <Timer />
              </div>
            </div>
            <div className="flex gap-1 flex-col items-center md:flex-row">
              <FormUploadFile
                name="gasFile"
                title="Vale de Gas:"
                errors={state.errors?.gasFile}
                acceptFile=".jpg,.jpeg,.pdf"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
              JPG, PNG o PDF
            </p>
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

function Timer() {
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
