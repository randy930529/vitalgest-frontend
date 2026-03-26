"use client";

import { DelegationType } from "@/app/lib/definitions";
import { createSupplyInPharmacy } from "@/app/lib/actions/supply";
import { getCustomDelegations } from "@/app/lib/utils";
import { GenericForm } from "@/app/ui/components/generic-form";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";

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

  const pharmaciesOptions = delegations.map(({ name, pharmacy }) => ({
    id: pharmacy.id,
    label: name,
    value: pharmacy.id,
  }));

  const fields = getFormConfigFields("supplyPharmacy", [
    {
      type: "select",
      name: "pharmacy",
      title: "Delegación",
      options: pharmaciesOptions,
      defaultValue: String(pharmacyId),
      required: true,
    },
  ]);

  return (
    <GenericForm
      fields={fields}
      onSubmit={createSupplyInPharmacy}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}
