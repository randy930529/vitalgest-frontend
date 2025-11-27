"use client";

import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { DelegationType } from "@/app/lib/definitions";
import {
  createSupplyInPharmacy,
  SupplyInPharmacyState,
} from "@/app/lib/actions/supply";
import { Button } from "@/app/ui/button";
import {
  FormDatepicker,
  FormInputSingle,
  FormSelect,
} from "@/app/ui/dashboard/form-fields";

export const customUnits = [
  {
    id: 0,
    value: "",
    label: "Seleccione Unidad de Medida",
  },
  {
    id: 1,
    value: "mg",
    label: "Miligramos",
  },
  {
    id: 2,
    value: "g",
    label: "Gramos",
  },
  {
    id: 3,
    value: "mcg",
    label: "Microgramos",
  },
  {
    id: 4,
    value: "ml",
    label: "Mililitros",
  },
  {
    id: 5,
    value: "l",
    label: "Litros",
  },
  {
    id: 6,
    value: "unit",
    label: "Unidades",
  },
  {
    id: 7,
    value: "tablet",
    label: "Tableta",
  },
  {
    id: 8,
    value: "capsule",
    label: "Cápsula",
  },
  {
    id: 9,
    value: "drop",
    label: "Gotas",
  },
  {
    id: 10,
    value: "sachet",
    label: "Sobre",
  },
  {
    id: 11,
    value: "ampoule",
    label: "Ampolla",
  },
  {
    id: 12,
    value: "vial",
    label: "Frasco/Ampolleta",
  },
  {
    id: 13,
    value: "patch",
    label: "Parche",
  },
  {
    id: 14,
    value: "suppository",
    label: "Supositorio",
  },
  {
    id: 15,
    value: "tube",
    label: "Tubo",
  },
];

export default function SupplyForm({
  pharmacyId,
  delegations,
  onClose,
}: {
  pharmacyId: string | number;
  delegations: DelegationType[];
  onClose?: () => void;
}) {
  // (Component) Formulario de Insumos - [CSR]

  const customSelectedDelegations = delegations.map(
    ({ id, name, pharmacy }) => ({
      id,
      value: pharmacy.id,
      label: name,
    })
  );

  const initialState: SupplyInPharmacyState = { errors: {}, message: null };
  const [state, formAction] = useActionState(
    createSupplyInPharmacy,
    initialState
  );

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
        <FormSelect
          key={pharmacyId}
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
          defaultValue={pharmacyId}
        />

        <FormInputSingle
          key="select-category"
          type="text"
          name="category"
          title="Categoría"
          errors={state.errors?.category}
          required
        />

        <FormInputSingle
          key="select-specification"
          type="text"
          name="specification"
          title="Especificación"
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

        <div className="w-3/12 md:w-2/12">
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
