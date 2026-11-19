"use client";

import { useActionState, useEffect, useMemo } from "react";
import { CustomOptions, ShiftType, UserType } from "@/app/lib/definitions";
import { ShiftState } from "@/app/lib/config/stateConfigs";
import { createShift, updateShift } from "@/app/lib/actions/shift";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { Button } from "@/app/ui/button";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { SaveIcon } from "@/app/ui/components/icons";

type ShiftAssignmentFormProps = {
  guardId: string;
  shifts: ShiftType[];
  ambulances: CustomOptions[];
  drivers: UserType[];
  paramedics: UserType[];
  editingShift?: ShiftType;
  onSaved: (shift: ShiftType, mode: "create" | "edit") => void;
  onCancel: () => void;
  setIsLoading?: (loading: boolean) => void;
};

export default function ShiftAssignmentForm({
  guardId,
  shifts,
  ambulances,
  drivers,
  paramedics,
  editingShift,
  onSaved,
  onCancel,
  setIsLoading,
}: ShiftAssignmentFormProps) {
  const initialState: ShiftState = { errors: {}, message: null };
  const mode = editingShift ? "edit" : "create";

  const [state, formAction, isLoading] = useActionState(
    async (prevState: ShiftState, formData: FormData) => {
      if (editingShift?.id) {
        return updateShift(editingShift.id, prevState, formData);
      }

      return createShift(prevState, formData);
    },
    initialState,
  );

  const usedResourceIds = useMemo(() => {
    const ambulanceIds = new Set<string>();
    const driverIds = new Set<string>();
    const paramedicIds = new Set<string>();

    shifts
      .filter((shift) => shift.id !== editingShift?.id)
      .forEach((shift) => {
        if (shift.ambulance?.id) {
          ambulanceIds.add(String(shift.ambulance.id));
        }

        if (shift.driver?.id) {
          driverIds.add(String(shift.driver.id));
        }

        if (shift.paramedical?.id) {
          paramedicIds.add(String(shift.paramedical.id));
        }
      });

    return { ambulanceIds, driverIds, paramedicIds };
  }, [shifts, editingShift?.id]);

  const availableAmbulances = useMemo(() => {
    const currentAmbulanceId = editingShift?.ambulance?.id
      ? String(editingShift.ambulance.id)
      : "";

    return ambulances.filter((option) => {
      const optionId = String(option.value);
      return (
        optionId === currentAmbulanceId ||
        !usedResourceIds.ambulanceIds.has(optionId)
      );
    });
  }, [ambulances, editingShift?.ambulance?.id, usedResourceIds.ambulanceIds]);

  const availableDrivers = useMemo(() => {
    const currentDriverId = editingShift?.driver?.id
      ? String(editingShift.driver.id)
      : "";

    return drivers.filter((option) => {
      const optionId = String(option.id);
      return (
        optionId === currentDriverId || !usedResourceIds.driverIds.has(optionId)
      );
    });
  }, [drivers, editingShift?.driver?.id, usedResourceIds.driverIds]);

  const availableParamedics = useMemo(() => {
    const currentParamedicId = editingShift?.paramedical?.id
      ? String(editingShift.paramedical.id)
      : "";

    return paramedics.filter((option) => {
      const optionId = String(option.id);
      return (
        optionId === currentParamedicId ||
        !usedResourceIds.paramedicIds.has(optionId)
      );
    });
  }, [paramedics, editingShift?.paramedical?.id, usedResourceIds.paramedicIds]);

  const ambulance = useMemo(() => {
    const shift = state.shift || editingShift;
    const ambulanceId = state.formData?.get("ambulance") as string | null;
    const selctedAmbulance = ambulances.find((a) => a.value === ambulanceId);

    if (shift && selctedAmbulance) {
      return {
        ...shift.ambulance,
        id: selctedAmbulance.id as string,
        number: selctedAmbulance.label,
      };
    }
  }, [
    ambulances,
    editingShift?.ambulance.id,
    state.shift?.ambulance.id,
    state.formData,
  ]);

  const paramedical = useMemo(() => {
    const shift = state.shift || editingShift;
    const paramedicalId = state.formData?.get("paramedical") as string | null;
    const selctedParamedical = paramedics.find((p) => p.id === paramedicalId);

    if (shift && selctedParamedical) {
      return selctedParamedical;
    }
  }, [
    editingShift?.paramedical.id,
    state.shift?.paramedical.id,
    state.formData,
    paramedics,
  ]);

  const driver = useMemo(() => {
    const shift = state.shift || editingShift;
    const driverId = state.formData?.get("driver") as string | null;
    const selctedDriver = drivers.find((p) => p.id === driverId);

    if (shift && selctedDriver) {
      return selctedDriver;
    }
  }, [
    editingShift?.driver.id,
    state.shift?.driver.id,
    state.formData,
    drivers,
  ]);

  useFormNotifications({
    state,
    onSuccess: () => {
      const shift = state.shift || editingShift;
      if (shift && ambulance && paramedical && driver) {
        onSaved({ ...shift, ambulance, paramedical, driver }, mode);
      }
    },
  });

  useEffect(() => {
    setIsLoading?.(isLoading);
  }, [isLoading, setIsLoading]);

  return (
    <form
      key={editingShift?.id || "new-shift"}
      action={formAction}
      className="space-y-4"
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
        <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          {mode === "edit" ? "Editar Turno" : "Nuevo Turno"}
        </h4>

        <input
          type="text"
          name="name"
          defaultValue={editingShift?.name || ""}
          className="hidden"
        />

        <input
          type="text"
          name="guard"
          defaultValue={guardId}
          className="hidden"
        />

        <FormSelect
          key={`ambulance-${ambulance?.id || editingShift?.id || "new"}`}
          name="ambulance"
          title="Ambulancia"
          options={[
            { id: "", label: "Seleccione Ambulancia", value: "" },
            ...availableAmbulances,
          ]}
          defaultValue={ambulance?.id || editingShift?.ambulance?.id}
          errors={state.errors?.ambulanceId}
          required
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            key={`driver-${driver?.id || editingShift?.id || "new"}`}
            name="driver"
            title="Chofer"
            options={[
              { id: "", label: "Seleccione Chofer", value: "" },
              ...availableDrivers.map((driver) => ({
                id: driver.id,
                label: `${driver.name} ${driver.lastname}`,
                value: driver.id,
              })),
            ]}
            defaultValue={driver?.id || editingShift?.driver?.id}
            errors={state.errors?.driverId}
            required
          />

          <FormSelect
            key={`paramedic-${paramedical?.id || editingShift?.id || "new"}`}
            name="paramedical"
            title="Paramédico"
            options={[
              { id: "", label: "Seleccione Paramédico", value: "" },
              ...availableParamedics.map((paramedic) => ({
                id: paramedic.id,
                label: `${paramedic.name} ${paramedic.lastname}`,
                value: paramedic.id,
              })),
            ]}
            defaultValue={paramedical?.id || editingShift?.paramedical?.id}
            errors={state.errors?.paramedicalId}
            required
          />
        </div>

        <div className="flex flex-col justify-end gap-3 pt-4 sm:flex-row">
          <Button
            type="button"
            onClick={onCancel}
            variant="formSecondary"
            disabled={isLoading}
            additionalClassName="h-11 rounded-xl px-4 text-sm"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="formPrimary"
            isLoading={isLoading}
            additionalClassName="h-11 rounded-xl px-4 text-sm"
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
}
