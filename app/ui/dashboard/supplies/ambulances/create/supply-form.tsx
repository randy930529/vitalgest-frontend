"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AmbulanceAreaType,
  AmbulanceType,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import {
  createSupplyInAmbulance,
  SupplyInAmbulanceState,
} from "@/app/lib/actions/supply";
import { Button } from "@/app/ui/button";
import { FormInputSingle, FormSelect } from "@/app/ui/dashboard/form-fields";
import { Badge } from "@/app/ui/badges";

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

  const [quantity, setQuantity] = useState<number | null>(null);
  const [avaibleQuantity, setAvaibleQuantity] = useState<number | null>(null);

  useEffect(() => {
    state.message && toast.success(state.message);
    state.message && onClose && onClose();
  }, [state.message]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  function handleSupply(name: string, supplyId: string) {
    const { avaible_quantity } =
      suppliesPharmacy.find(({ id }) => id === supplyId) || {};

    setAvaibleQuantity(avaible_quantity || null);
    setQuantity(avaible_quantity || null);
  }

  function handleAvaibleQuantitySupply(name: string, value: string) {
    if (value && avaibleQuantity) {
      const rest = Number(avaibleQuantity) - Number(value);

      if (Number(value) >= 0 && rest >= 0) {
        setQuantity(rest);
      }
    }
  }

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
          handleOption={handleSupply}
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

        {avaibleQuantity && (
          <div className="w-5/12 space-y-2 md:w-3/12">
            <p>Disponibilidad</p>
            <Badge
              title={String(quantity)}
              success={quantity ? quantity > 5 : false}
              pending={quantity ? quantity <= 5 : undefined}
            />
          </div>
        )}

        <div className="w-3/12 md:w-2/12">
          <FormInputSingle
            key={`input-avaibleQuantity-${avaibleQuantity}`}
            type="number"
            name="avaibleQuantity"
            title="Cantidad"
            placeholder="0"
            initialValue={String(0)}
            errors={state.errors?.avaibleQuantity}
            handleOption={handleAvaibleQuantitySupply}
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
