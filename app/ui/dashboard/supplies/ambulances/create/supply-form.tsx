"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AmbulanceAreaType,
  AmbulanceType,
  CustomOptions,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import { createSupplyInAmbulance } from "@/app/lib/actions/supply";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";
import { SupplyAmbulanceState } from "@/app/lib/config/stateConfigs";
import { Badge } from "@/app/ui/components/badges";
import { GenericForm } from "@/app/ui/components/generic-form";
import { FormInputSingle, FormSelect } from "@/app/ui/dashboard/form-fields";

export default function SupplyForm({
  ambulances,
  areas,
  suppliesPharmacy,
  onClose,
}: {
  ambulances: AmbulanceType[];
  areas: AmbulanceAreaType[];
  suppliesPharmacy: SupplyPharmacyType[];
  onClose?: () => void;
}) {
  // (Component) Formulario de Insumos - [CSR]

  const searchParams = useSearchParams();
  const ambulanceId = searchParams.get("ambulance") || "";
  const pharmacyId = searchParams.get("pharmacy") || "";
  const pharmacyName = searchParams.get("pharmacyName") || "";

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
      options: [
        {
          id: 0,
          value: "",
          label: "Seleccione una Ambulancia",
        },
        ...customSelectedAmbulances,
      ],
      defaultValue: ambulanceId,
      required: true,
    },
    {
      type: "select",
      name: "area",
      title: "Área en la Ambulancia",
      options: [
        {
          id: 0,
          value: "",
          label: "Seleccione un Área",
        },
        ...customSelectedAreas,
      ],
      required: true,
    },
    {
      type: "custom",
      name: "customFiles",
      component: (
        <CustomFiles
          suppliesPharmacy={suppliesPharmacy}
          customSelectedSuppliesPharmacy={customSelectedSuppliesPharmacy}
        />
      ),
    },
    {
      type: "number",
      name: "minQuantity",
      title: "Cantidad Mínima",
      placeholder: "Mayor a 0",
      required: true,
    },
    {
      type: "custom",
      name: "pharmacyId",
      component: (
        <FormInputSingle
          key="input-pharmacyId"
          type="hidden"
          name="pharmacy"
          initialValue={pharmacyId}
        />
      ),
    },
  ]);

  return (
    <>
      <div className="mb-4 text-sm">
        <h3 className="font-semibold text-slate-700 uppercase">{`De farmacia ${pharmacyName}:`}</h3>
      </div>
      <GenericForm
        key="form-supply-ambulance"
        fields={fields}
        onSubmit={createSupplyInAmbulance}
        initialState={{ errors: {}, message: null }}
        onCancel={onClose}
      />
    </>
  );
}

function CustomFiles({
  suppliesPharmacy,
  customSelectedSuppliesPharmacy,
  state,
}: {
  suppliesPharmacy: SupplyPharmacyType[];
  customSelectedSuppliesPharmacy: CustomOptions[];
  state?: SupplyAmbulanceState;
}) {
  const [selectedSupplyId, setSelectedSupplyId] = useState(
    String(state?.formData?.get("supplyId") || ""),
  );
  const [requestedQuantity, setRequestedQuantity] = useState(
    Number(state?.formData?.get("avaibleQuantity") || "") || 0,
  );

  const avaibleQuantity = useMemo(
    () =>
      suppliesPharmacy.find(({ id }) => id === selectedSupplyId)
        ?.avaible_quantity ?? null,
    [selectedSupplyId, suppliesPharmacy],
  );
  const quantity = useMemo(
    () =>
      avaibleQuantity === null
        ? null
        : Math.max(avaibleQuantity - requestedQuantity, 0),
    [avaibleQuantity, requestedQuantity],
  );

  function handleSupply(name: string, supplyId: string) {
    setSelectedSupplyId(supplyId);
    setRequestedQuantity(0);
  }

  function handleAvaibleQuantitySupply(name: string, value: string) {
    const requested = Number(value);

    if (
      value &&
      avaibleQuantity !== null &&
      Number.isFinite(requested) &&
      requested >= 0 &&
      requested <= avaibleQuantity
    ) {
      setRequestedQuantity(requested);
    }
  }

  return (
    <div key="custom-files" className="contents">
      <FormSelect
        key={`select-supply ${String(state?.formData?.get("supplyId") || "")}`}
        name="supplyId"
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
        defaultValue={String(state?.formData?.get("supplyId") || "")}
        errors={state?.errors?.supplyId}
        required
      />

      <div>
        <p className="mb-1.5 mt-3 text-sm font-medium text-gray-900 dark:text-white sm:mb-2 sm:mt-4 block">
          Disponibilidad
        </p>
        {avaibleQuantity !== null ? (
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

      <div className="grid grid-cols-2 grid-rows-3 [&>*:nth-child(1)]:col-span-2 [&>*:nth-child(2)]:col-start-1 [&>*:nth-child(3)]:col-span-2">
        <FormInputSingle
          key={`input-avaibleQuantity-${avaibleQuantity}`}
          type="number"
          name="avaibleQuantity"
          title="Cantidad"
          placeholder="0"
          initialValue={String(state?.formData?.get("avaibleQuantity") || "")}
          handleOption={handleAvaibleQuantitySupply}
          disabled={!state?.errors?.avaibleQuantity && !avaibleQuantity}
          errors={state?.errors?.avaibleQuantity}
          required
        />
      </div>
    </div>
  );
}
