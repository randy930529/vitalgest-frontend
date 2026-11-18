"use client";

import { DelegationType } from "@/app/lib/definitions";
import { createUser } from "@/app/lib/actions/user";
import { GenericForm } from "@/app/ui/components/generic-form";
import { getCustomDelegations } from "@/app/lib/utils";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";

export default function UserForm({
  onClose,
  delegations,
}: {
  onClose?: () => void;
  delegations?: DelegationType[];
}) {
  // (Component) Formulario de usuario - [CSR]

  const fields = getFormConfigFields("user", [
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
      onSubmit={createUser}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}
