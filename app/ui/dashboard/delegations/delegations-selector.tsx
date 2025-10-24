"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { DelegationType } from "@/app/lib/definitions";
import { FormSelect } from "@/app/ui/dashboard/form-fields";

export default function DelegationsSelector({
  delegations,
  defaultValue,
  errors,
}: {
  delegations: DelegationType[];
  defaultValue?: string | number;
  errors?: string[];
}) {
  // Selector interactivo de delegaciones - [CSR]
  const showError = useRef(false);

  const customSelectedDelegations = delegations.map(
    ({ id, state, municipality }, index) => ({
      id: index + 1,
      value: id,
      label: state.name + " - " + municipality.name,
    })
  );
  customSelectedDelegations.unshift({
    id: 0,
    value: "",
    label: "Seleccione la Delegación",
  });

  useEffect(() => {
    if (delegations?.length === 0 && !showError.current) {
      toast.error("Debe registrar al menos una delegación.");
      showError.current = true;
    }
  }, [delegations]);

  return (
    <FormSelect
      key={String(defaultValue || "")}
      name="delegation"
      title="Delegación"
      options={customSelectedDelegations}
      defaultValue={defaultValue}
      errors={errors}
      required
    />
  );
}
