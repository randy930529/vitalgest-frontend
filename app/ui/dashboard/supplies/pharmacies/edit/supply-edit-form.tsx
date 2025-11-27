"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import toast from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { DelegationType, SupplyPharmacyType } from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import {
  SupplyInPharmacyState,
  updateSupplyInPharmacy,
} from "@/app/lib/actions/supply";
import { Button } from "@/app/ui/button";
import {
  FormDatepicker,
  FormInputSingle,
  FormSelect,
} from "@/app/ui/dashboard/form-fields";
import { customUnits } from "@/app/ui/dashboard/supplies/pharmacies/create/supply-form";

export default function SupplyEditForm({
  data,
}: {
  data: [SupplyPharmacyType | undefined, DelegationType[]];
}) {
  // (Componente) Formulario de edición de insumo - [CSR]

  const [supply, delegations] = data;

  const customSelectedDelegations = delegations.map(
    ({ id, name, pharmacy }) => ({
      id,
      value: pharmacy.id,
      label: name,
    })
  );

  if (!supply) {
    return notFound();
  }

  const initialState: SupplyInPharmacyState = { errors: {}, message: null };
  const updateSupplyWithId = updateSupplyInPharmacy.bind(
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

  const datePicker = new Date(supply.expiration_date)
    .toISOString()
    .split("T")[0];
  const dateStart = new Date().toISOString().split("T")[0];

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
              key={supply.pharmacy_id}
              name="pharmacy"
              title="Delegación"
              options={[
                {
                  id: 0,
                  value: "",
                  label: "Seleccione la Delegación",
                },
                ...customSelectedDelegations,
              ]}
              defaultValue={supply.pharmacy_id}
            />

            <FormInputSingle
              key="select-category"
              type="text"
              name="category"
              title="Categoría"
              initialValue={supply.category}
              errors={state.errors?.category}
              required
            />

            <FormInputSingle
              key="select-specification"
              type="text"
              name="specification"
              title="Especificación"
              initialValue={supply.specification}
              errors={state.errors?.specification}
              required
            />

            <FormSelect
              key="select-measurementUnit"
              name="measurementUnit"
              title="Unidad de Medida"
              options={customUnits}
              defaultValue={supply.measurement_unit}
              errors={state.errors?.measurementUnit}
              required
            />

            <div className="flex flex-col gap-2 w-2/5">
              <FormDatepicker
                key="datepicker-expirationDate"
                name="expirationDate"
                title="Fecha de Caducidad"
                initialDate={datePicker}
                dateStart={dateStart}
                errors={state.errors?.expirationDate}
                required
              />
            </div>

            <div className="w-2/12">
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
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href={`/dashboard/supplies/pharmacies?pharmacy=${supply.pharmacy_id}`}
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
