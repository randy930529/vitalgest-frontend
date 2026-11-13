"use client";

import { useState } from "react";
import {
  AmbulanceAreaType,
  AmbulanceType,
  CustomOptions,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import { createSupplyInAmbulance } from "@/app/lib/actions/supply";
import { FormInputSingle, FormSelect } from "@/app/ui/dashboard/form-fields";
import { Badge } from "@/app/ui/components/badges";
import { GenericForm } from "@/app/ui/components/generic-form";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";

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
    ({ id, category, specification }) => ({
      id,
      value: id,
      label: `${category} - ${specification}`,
    }),
  );
  const customSelectedAreas = areas.map(({ id, name }) => ({
    id,
    value: id,
    label: name,
  }));

  const fields = getFormConfigFields("supplyAmbulance", [
    {
      type: "select",
      name: "ambulance",
      title: "Ambulancia",
      options: customSelectedAmbulances,
      defaultValue: String(ambulanceId),
      required: true,
    },
    {
      type: "select",
      name: "area",
      title: "Área en la Ambulancia",
      options: customSelectedAreas,
      required: true,
    },
    {
      type: "custom",
      name: "customFiles",
      component: CustomFiles({
        suppliesPharmacy,
        customSelectedSuppliesPharmacy,
      }),
    },
    {
      type: "number",
      name: "minQuantity",
      title: "Cantidad Mínima",
      placeholder: "Mayor a 0",
      required: true,
    },
  ]);

  return (
    <GenericForm
      fields={fields}
      onSubmit={createSupplyInAmbulance}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}

function CustomFiles({
  suppliesPharmacy,
  customSelectedSuppliesPharmacy,
}: {
  suppliesPharmacy: SupplyPharmacyType[];
  customSelectedSuppliesPharmacy: CustomOptions[];
}) {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [avaibleQuantity, setAvaibleQuantity] = useState<number | null>(null);

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
    <>
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
        handleOption={handleSupply}
        required
      />

      <div>
        <p className="mb-1.5 mt-3 text-sm font-medium text-gray-900 dark:text-white sm:mb-2 sm:mt-4 block">
          Disponibilidad
        </p>
        {avaibleQuantity ? (
          <Badge
            title={String(quantity)}
            success={quantity ? quantity > 5 : false}
            pending={quantity ? quantity <= 5 : undefined}
          />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Seleccione un insumo para ver la disponibilidad
          </p>
        )}
      </div>

      <div className="w-5/12 md:w-4/12">
        <FormInputSingle
          key={`input-avaibleQuantity-${avaibleQuantity}`}
          type="number"
          name="avaibleQuantity"
          title="Cantidad"
          placeholder="0"
          initialValue={String(0)}
          handleOption={handleAvaibleQuantitySupply}
          disabled={!avaibleQuantity}
          required
        />
      </div>
    </>
  );
}
