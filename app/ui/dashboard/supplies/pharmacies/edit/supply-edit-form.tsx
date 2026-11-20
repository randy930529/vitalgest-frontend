"use client";

import { useActionState } from "react";
import { notFound, useRouter } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { DelegationType, SupplyPharmacyType } from "@/app/lib/definitions";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import { updateSupplyInPharmacy } from "@/app/lib/actions/supply";
import { SupplyPharmacyState } from "@/app/lib/config/stateConfigs";
import { FormButtons } from "@/app/ui/button";
import {
  FormDatepicker,
  FormInput,
  FormSelect,
} from "@/app/ui/dashboard/form-fields";
import { customUnits } from "@/app/lib/config/selectOptions";

export default function SupplyEditForm({
  data,
}: {
  data: [SupplyPharmacyType | undefined, DelegationType[]];
}) {
  // (Componente) Formulario de edición de insumo - [CSR]

  const router = useRouter();
  const [supply, delegations] = data;

  const customSelectedDelegations = delegations.map(
    ({ id, name, pharmacy }) => ({
      id,
      value: pharmacy.id,
      label: name,
    }),
  );

  if (!supply) {
    return notFound();
  }

  const initialState: SupplyPharmacyState = { errors: {}, message: null };
  const updateSupplyWithId = updateSupplyInPharmacy.bind(
    null,
    supply?.id || "",
  );
  const [state, formAction, isLoading] = useActionState(
    updateSupplyWithId,
    initialState,
  );

  useFormNotifications({ state });

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
          supply.expiration_date,
        )}`}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form className="w-3/5" action={formAction}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <FormSelect
              key={supply.pharmacy_id}
              name="pharmacy"
              title="Farmacia"
              options={[
                {
                  id: 0,
                  value: "",
                  label: "Seleccione la Farmacia",
                },
                ...customSelectedDelegations,
              ]}
              required
              defaultValue={supply.pharmacy_id}
            />

            <FormInput
              key="category"
              name="category"
              initialValue={String(supply.category)}
              errors={state.errors?.category}
              customFormInput={{
                category: {
                  type: "text",
                  title: "Categoría",
                  required: true,
                },
              }}
            />

            <FormInput
              key="specification"
              name="specification"
              initialValue={String(supply.specification)}
              errors={state.errors?.specification}
              customFormInput={{
                specification: {
                  type: "text",
                  title: "Especificación",
                  required: true,
                },
              }}
            />

            <FormSelect
              key="select-measurementUnit"
              name="measurementUnit"
              title="Unidad de Medida"
              options={[...customUnits]}
              defaultValue={supply.measurement_unit}
              errors={state.errors?.measurementUnit}
              required
            />

            <FormDatepicker
              key="datepicker-expirationDate"
              name="expirationDate"
              title="Fecha de Caducidad"
              initialDate={datePicker}
              dateStart={dateStart}
              errors={state.errors?.expirationDate}
              required
            />

            <div className="w-5/12">
              <FormInput
                key="avaibleQuantity"
                name="avaibleQuantity"
                initialValue={String(supply.avaible_quantity)}
                errors={state.errors?.avaibleQuantity}
                customFormInput={{
                  avaibleQuantity: {
                    type: "number",
                    title: "Cantidad",
                    required: true,
                  },
                }}
              />
            </div>
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
