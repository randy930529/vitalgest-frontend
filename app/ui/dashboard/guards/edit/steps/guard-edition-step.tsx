"use client";

import { useActionState, useEffect, useState } from "react";
import {
  CustomOptions,
  DelegationType,
  GuardType,
} from "@/app/lib/definitions";
import { updateGuard } from "@/app/lib/actions/guard";
import { GuardState } from "@/app/lib/config/stateConfigs";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";
import { FormDatepicker, FormSelect } from "@/app/ui/dashboard/form-fields";
import { SaveIcon } from "@/app/ui/components/icons";
import { Button } from "@/app/ui/button";

interface GuardEditionStepProps {
  guardChiefs: CustomOptions[];
  delegations: DelegationType[];
  existingGuard: GuardType;
}

export default function GuardEditionStep({
  guardChiefs,
  delegations,
  existingGuard,
}: GuardEditionStepProps) {
  // (Component) Paso 1: Editar guardia - [CSR]

  const initialState: GuardState = {
    errors: {},
    message: null,
  };
  const datePicker = new Date(existingGuard.date).toISOString().split("T")[0];
  const dateStart = new Date().toISOString().split("T")[0];

  const updateDelegationWithId = updateGuard.bind(null, existingGuard.id);
  const [state, formAction, isLoading] = useActionState(
    updateDelegationWithId,
    initialState,
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsMounted(true), 20);
    return () => clearTimeout(timeoutId);
  }, []);

  useFormNotifications({
    state,
    onClose: () => {},
  });

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className={`space-y-4 transition-all delay-75 duration-300 ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Datos Generales
          </h4>

          {delegations && (
            <DelegationsSelector
              delegations={delegations}
              defaultValue={existingGuard.delegation?.id || ""}
              errors={state.errors?.delegationId}
            />
          )}

          <FormSelect
            key={"guardChief" + existingGuard.guardChief?.id}
            name="guardChief"
            title="Jefe de Guardia"
            options={[
              { id: "", label: "Seleccione Jefe de Guardia", value: "" },
              ...guardChiefs,
            ]}
            defaultValue={existingGuard.guardChief.id}
            errors={state.errors?.guardChief}
            required
          />

          <div className="relative max-w-sm mt-4 mb-2">
            <FormDatepicker
              name="date"
              title="Fecha"
              initialDate={datePicker}
              dateStart={dateStart}
              errors={state.errors?.date}
              required
            />
          </div>

          <div className="relative max-w-fit mt-4 mb-2">
            <FormSelect
              key="state"
              name="state"
              title="Estado"
              options={[
                { id: "", label: "Seleccione el Estado", value: "" },
                { id: 1, value: "Nueva", label: "Nueva" },
                { id: 2, value: "En curso", label: "En curso" },
                { id: 3, value: "Cerrada", label: "Cerrada" },
              ]}
              defaultValue={existingGuard.state}
              errors={state.errors?.state}
              required
            />{" "}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="formPrimary"
            isLoading={isLoading}
            additionalClassName="h-11 rounded-xl px-6 text-sm"
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
