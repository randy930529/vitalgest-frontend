"use client";

import { DelegationType } from "@/app/lib/definitions";
import { createAmbulance } from "@/app/lib/actions/ambulance";
import { GenericForm } from "@/app/ui/components/GenericForm";
import { getCustomDelegations } from "@/app/lib/utils";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";

export default function AmbulanceForm({
  delegations,
  onClose,
}: {
  delegations?: DelegationType[];
  onClose?: () => void;
}) {
  // (Component) Formulario de Ambulancia - [CSR]

  const fields = getFormConfigFields("ambulance", [
    {
      type: "select",
      name: "delegation",
      title: "Delegación",
      options: getCustomDelegations(delegations),
      required: true,
    },
  ]);

  return (
    <GenericForm
      fields={fields}
      onSubmit={createAmbulance}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}
