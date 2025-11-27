"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  AmbulanceAreaType,
  AmbulanceType,
  SupplyAmbulanceType,
} from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import {
  SupplyInAmbulanceState,
  updateSupplyInAmbulance,
} from "@/app/lib/actions/supply";
import { Button } from "@/app/ui/button";
import { FormInputSingle, FormSelect } from "@/app/ui/dashboard/form-fields";

export default function SupplyEditForm({
  data,
}: {
  data: [
    SupplyAmbulanceType | undefined,
    string | number,
    AmbulanceType[],
    AmbulanceAreaType[]
  ];
}) {
  // (Componente) Formulario de edición de insumo - [CSR]

  const [supply, ambulanceId, ambulances, areas] = data;

  if (!supply) {
    return null;
  }

  const customSelectedAmbulances = ambulances.map(({ id, number }) => ({
    id,
    value: id,
    label: number,
  }));

  const customSelectedAreas = areas.map(({ id, name }) => ({
    id,
    value: id,
    label: name,
  }));

  const initialState: SupplyInAmbulanceState = { errors: {}, message: null };
  const updateSupplyWithId = updateSupplyInAmbulance.bind(
    null,
    supply?.id || ""
  );
  const [state, formAction] = useActionState(updateSupplyWithId, initialState);

  useEffect(() => {
    state.message && toast.success(state.message) && (state.message = null);
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {supply.category}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {`${supply.specification} - EXP. ${formatDateToDDMMYYYY(
          supply.expiration_date
        )}`}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form className="w-3/5" action={formAction}>
          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <FormSelect
              key="select-ambulance"
              name="ambulance"
              title="Ambulancia"
              options={[
                {
                  id: 0,
                  label: "Seleccione un Ambulancia",
                  value: "",
                },
                ...customSelectedAmbulances,
              ]}
              defaultValue={ambulanceId}
              errors={state.errors?.ambulanceId}
              required
            />

            <FormSelect
              key="select-area"
              name="area"
              title="Área en la Ambulancia"
              options={[
                {
                  id: 0,
                  label: "Seleccione el Área",
                  value: "",
                },
                ...customSelectedAreas,
              ]}
              defaultValue={supply.area_id}
              errors={state.errors?.areaId}
              required
            />

            <div className="w-3/12 md:w-2/12">
              <FormInputSingle
                key="input-avaibleQuantity"
                type="number"
                name="avaibleQuantity"
                title="Cantidad"
                placeholder="0"
                initialValue={String(supply.avaible_quantity)}
                errors={state.errors?.avaibleQuantity}
                required
              />
            </div>

            <div className="w-5/12 md:w-3/12">
              <FormInputSingle
                key="input-minQuantity"
                type="number"
                name="minQuantity"
                title="Cantidad Mínima"
                placeholder="0"
                initialValue={String(supply.min_quantity)}
                errors={state.errors?.minQuantity}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href={`/dashboard/supplies/ambulances?ambulance=${supply.ambulance_id}`}
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
    </main>
  );
}
