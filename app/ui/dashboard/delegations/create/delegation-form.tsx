"use client";

import { useEffect, useState } from "react";
import { createDelegation } from "@/app/lib/actions/delegation";
import {
  CustomMxState,
  CustomOptions,
  FormFieldType,
} from "@/app/lib/definitions";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { getMunicipalitiesOfState } from "@/app/lib/utils";
import { GenericForm } from "@/app/ui/components/generic-form";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";

export default function DelegationForm({
  customMxStates,
  onClose,
}: {
  customMxStates: CustomMxState[];
  onClose?: () => void;
}) {
  // (Component) Formulario de delegacion - [CSR]

  const fields = getFormConfigFields("delegation", [
    {
      type: "custom",
      name: "name",
      component: CustomFiles({ customMxStates }),
    },
  ]);

  return (
    <GenericForm
      fields={fields}
      onSubmit={createDelegation}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}

function CustomFiles({ customMxStates }: { customMxStates: CustomMxState[] }) {
  const [mxStateId, setMxStateId] = useState("");
  const [customMunicipalities, setCustomMunicipalities] = useState<
    CustomOptions[]
  >([]);

  useEffect(() => {
    setCustomMunicipalities(
      getMunicipalitiesOfState(mxStateId, customMxStates),
    );
  }, [mxStateId]);

  function handleOption(name: string, value: string) {
    setMxStateId(value);
  }

  return (
    <>
      <FormSelect
        key="state"
        name="state"
        title="Estado"
        defaultValue=""
        options={[
          { id: 0, label: "Seleccione el Estado", value: "" },
          ...customMxStates,
        ]}
        handleOption={handleOption}
        required
      />

      <FormSelect
        key="municipality"
        name="municipality"
        title="Municipio"
        defaultValue=""
        options={[
          {
            id: 0,
            label: "Seleccione el Municipio",
            value: "",
          },
          ...customMunicipalities,
        ]}
        required
        disabled={!mxStateId}
      />
    </>
  );
}
