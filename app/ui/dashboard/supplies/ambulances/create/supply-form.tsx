"use client";

import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  createSupplyInAmbulance,
  SupplyInAmbulanceState,
} from "@/app/lib/actions/supply";
import { Button } from "@/app/ui/button";
import { FormInputSingle, FormSelect } from "@/app/ui/dashboard/form-fields";
import {
  AmbulanceAreaType,
  AmbulanceType,
  SupplyPharmacyType,
} from "@/app/lib/definitions";

export default function SupplyForm({
  ambulanceId,
  ambulances,
  areas,
  suppliesPharmacy,
  onClose,
}: {
  ambulanceId: string | number;
  ambulances: AmbulanceType[];
  areas: AmbulanceAreaType[];
  suppliesPharmacy: SupplyPharmacyType[];
  onClose?: () => void;
}) {
  // (Component) Formulario de Insumos - [CSR]

  const customSelectedAmbulances = ambulances.map(({ id, number }) => ({
    id,
    value: id,
    label: number,
  }));
  const customSelectedSuppliesPharmacy = suppliesPharmacy.map(
    ({ id, category }) => ({
      id,
      value: id,
      label: category,
    })
  );
  const customSelectedAreas = areas.map(({ id, name }) => ({
    id,
    value: id,
    label: name,
  }));

  const initialState: SupplyInAmbulanceState = { errors: {}, message: null };
  const [state, formAction] = useActionState(
    createSupplyInAmbulance,
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

  return (
    <form action={formAction}>
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
          key="select-supply"
          name="supply"
          title="Insumo"
          options={[
            {
              id: 0,
              label: "Seleccione un Insumo",
              value: "",
            },
            ...customSelectedSuppliesPharmacy,
          ]}
          errors={state.errors?.supplyId}
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
            errors={state.errors?.minQuantity}
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
