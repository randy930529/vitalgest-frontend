"use client";

import { useEffect, useState } from "react";
import { createDelegation } from "@/app/lib/actions/delegation";
import { CustomMxState, CustomOptions } from "@/app/lib/definitions";
import { getMunicipalitiesOfState } from "@/app/lib/utils";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";
import { DelegationState } from "@/app/lib/config/stateConfigs";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { GenericForm } from "@/app/ui/components/generic-form";

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
      name: "estate-municipality",
      component: <CustomFiles customMxStates={customMxStates} />,
    },
  ]);

  return (
    <GenericForm
      key="form-delegation"
      fields={fields}
      onSubmit={createDelegation}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}

function CustomFiles({
  customMxStates,
  state,
}: {
  customMxStates: CustomMxState[];
  state?: DelegationState;
}) {
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
    <div key="custom-files" className="contents">
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
        errors={state?.errors?.state}
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
        disabled={!mxStateId}
        errors={state?.errors?.municipality}
        required
      />
    </div>
  );
}
