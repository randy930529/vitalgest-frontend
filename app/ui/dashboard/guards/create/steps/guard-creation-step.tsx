"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SaveIcon } from "@/app/ui/components/icons";
import {
  CustomOptions,
  DelegationType,
  GuardType,
} from "@/app/lib/definitions";
import { createGuard } from "@/app/lib/actions/guard";
import { GuardState } from "@/app/lib/config/stateConfigs";
import { Button } from "@/app/ui/button";
import GuardInfoCard, {
  GuardDisplayInfo,
} from "@/app/ui/dashboard/guards/create/guard-info-card";
import { FormDatepicker, FormSelect } from "@/app/ui/dashboard/form-fields";
import DelegationsSelector from "@/app/ui/dashboard/delegations/delegations-selector";

interface GuardCreationStepProps {
  guardChiefs: CustomOptions[];
  delegations: DelegationType[];
  onGuardCreated: (guard: GuardType, displayInfo?: GuardDisplayInfo) => void;
  existingGuard?: GuardType;
  existingDisplayInfo?: GuardDisplayInfo;
}

export default function GuardCreationStep({
  guardChiefs,
  delegations,
  onGuardCreated,
  existingGuard,
  existingDisplayInfo,
}: GuardCreationStepProps) {
  // (Component) Paso 1: Crear guardia - [CSR]

  const initialState: GuardState = { errors: {}, message: null };
  const dateStart = new Date().toISOString().split("T")[0];
  const [state, formAction, isLoading] = useActionState(
    createGuard,
    initialState,
  );
  const [isMounted, setIsMounted] = useState(false);
  const [guardDisplayInfo, setGuardDisplayInfo] = useState<GuardDisplayInfo>();
  const guardToDisplay = state.guard || existingGuard;
  const displayInfoToShow = guardDisplayInfo || existingDisplayInfo;

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsMounted(true), 20);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (state.guard) {
      toast.success(state.message || "Guardia creada exitosamente");
      onGuardCreated(state.guard, guardDisplayInfo);
    }
  }, [state.guard, state.message, onGuardCreated, guardDisplayInfo]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  const captureDisplayInfo = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const delegationSelect = form.elements.namedItem(
      "delegation",
    ) as HTMLSelectElement | null;
    const guardChiefSelect = form.elements.namedItem(
      "guardChief",
    ) as HTMLSelectElement | null;
    const dateInput = form.elements.namedItem(
      "date",
    ) as HTMLInputElement | null;

    const delegationName =
      delegationSelect?.selectedOptions?.[0]?.text?.trim() || "-";
    const guardChiefName =
      guardChiefSelect?.selectedOptions?.[0]?.text?.trim() || "Sin asignar";

    setGuardDisplayInfo({
      delegationName,
      guardChiefName,
      date: dateInput?.value || dateStart,
      state: "Nueva",
    });
  };

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        onSubmitCapture={captureDisplayInfo}
        className={`space-y-4 transition-all delay-75 duration-300 ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {!guardToDisplay && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Datos Generales
            </h4>

            <DelegationsSelector
              delegations={delegations}
              defaultValue={state.guard?.delegation?.id}
              errors={state.errors?.delegationId}
            />

            <FormSelect
              key={"guardChief" + state.guard?.guardChief?.id}
              name="guardChief"
              title="Jefe de Guardia"
              options={[
                { id: "", label: "Seleccione Jefe de Guardia", value: "" },
                ...guardChiefs,
              ]}
              defaultValue={state.guard?.guardChief?.id}
              errors={state.errors?.guardChief}
              required
            />

            <div className="relative max-w-sm mt-4 mb-2">
              <FormDatepicker
                name="date"
                title="Fecha"
                initialDate={dateStart}
                dateStart={dateStart}
                errors={state.errors?.date}
                required
              />
            </div>
          </div>
        )}

        {/* Guard Status Display */}
        {guardToDisplay && (
          <GuardInfoCard
            guard={guardToDisplay}
            display={displayInfoToShow}
            title="Informacion de la Guardia"
          />
        )}

        {!guardToDisplay && (
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="formPrimary"
              isLoading={isLoading}
              additionalClassName="h-11 rounded-xl px-6 text-sm"
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              Crear Guardia
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
