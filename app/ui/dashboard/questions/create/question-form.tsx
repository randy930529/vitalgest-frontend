"use client";

import { DelegationType } from "@/app/lib/definitions";
import { createQuestion } from "@/app/lib/actions/question";
import { GenericForm } from "@/app/ui/components/generic-form";
import { getCustomDelegations } from "@/app/lib/utils";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";

export default function QuestionForm({
  delegations,
  onClose,
}: {
  delegations?: DelegationType[];
  onClose?: () => void;
}) {
  // (Component) Formulario de Pregunta de Checklist - [CSR]

  const fields = getFormConfigFields("question", [
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
      onSubmit={createQuestion}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}
