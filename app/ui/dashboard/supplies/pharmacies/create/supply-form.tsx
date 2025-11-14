"use client";

import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { createSupply, SupplyState } from "@/app/lib/actions/supply";
import { Button } from "@/app/ui/button";
import {
  FormDatepicker,
  FormInputSingle,
  FormSelect,
} from "@/app/ui/dashboard/form-fields";

export const customCategories = [
  {
    id: 1,
    value: "",
    label: "Seleccione una Categoría",
  },
  {
    id: 2,
    value: "Bolsa de válvula - mascarilla (BVM)",
    label: "Bolsa de válvula - mascarilla (BVM)",
  },
];

export const customSpecifications = [
  {
    id: 1,
    value: "",
    label: "Seleccione la Especificación",
  },
  {
    id: 2,
    value: "Adulto",
    label: "Adulto",
  },
];

export const customUnits = [
  {
    id: 1,
    value: "",
    label: "Seleccione Unidad de Medida",
  },
  {
    id: 2,
    value: "unit",
    label: "Unit",
  },
];

export default function SupplyForm({
  pharmacyId,
  onClose,
}: {
  pharmacyId: string | number;
  onClose?: () => void;
}) {
  // (Component) Formulario de Insumos - [CSR]

  const initialState: SupplyState = { errors: {}, message: null };
  const [state, formAction] = useActionState(createSupply, initialState);

  useEffect(() => {
    state.message && toast.success(state.message);
    state.message && onClose && onClose();
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  const dateStart = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction}>
      <div className="grid gap-4 mb-4 sm:grid-cols-1">
        <input
          type="text"
          name="pharmacy"
          defaultValue={pharmacyId}
          className="hidden"
        />
        <FormSelect
          key="select-category"
          name="category"
          title="Categoría"
          options={customCategories}
          errors={state.errors?.category}
          required
        />

        <FormSelect
          key="select-specification"
          name="specification"
          title="Especificación"
          options={customSpecifications}
          errors={state.errors?.specification}
          required
        />

        <FormSelect
          key="select-measurementUnit"
          name="measurementUnit"
          title="Unidad de Medida"
          options={customUnits}
          errors={state.errors?.measurementUnit}
          required
        />

        <div className="flex flex-col gap-2 w-2/5">
          <FormDatepicker
            key="datepicker-expirationDate"
            name="expirationDate"
            title="Fecha de Caducidad"
            initialDate={dateStart}
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
            errors={state.errors?.avaibleQuantity}
            required
          />
        </div>
      </div>
      <div className="w-full flex justify-end gap-4">
        <Button
          type="reset"
          onMouseDown={onClose}
          className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}
