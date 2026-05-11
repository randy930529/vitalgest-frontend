"use client";

import { updateUserPassword } from "@/app/lib/actions/user";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";
import { GenericForm } from "@/app/ui/components/generic-form";

export default function ChangePasswordForm({
  userId,
  onClose,
}: {
  onClose?: () => void;
  userId: string;
}) {
  // (Component) Formulario cambio de contraseña - [CSR]

  const fields = getFormConfigFields("changePassword");

  return (
    <GenericForm
      fields={fields}
      onSubmit={updateUserPassword.bind(null, userId)}
      onSuccess={onClose}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}
