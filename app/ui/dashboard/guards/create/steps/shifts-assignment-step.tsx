"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { CustomOptions, GuardType, ShiftType } from "@/app/lib/definitions";
import { createShift } from "@/app/lib/actions/shift";
import { ShiftState } from "@/app/lib/config/stateConfigs";
import { Button } from "@/app/ui/button";
import GuardInfoCard, {
  GuardDisplayInfo,
} from "@/app/ui/dashboard/guards/create/guard-info-card";
import { FormSelect } from "@/app/ui/dashboard/form-fields";

interface ShiftsAssignmentStepProps {
  guard: GuardType;
  ambulances: CustomOptions[];
  drivers: CustomOptions[];
  paramedics: CustomOptions[];
  guardDisplayInfo?: GuardDisplayInfo;
  shifts: ShiftType[];
  onShiftAdded: (shift: ShiftType) => void;
  onShiftRemoved: (shiftId: string) => void;
  setIsLoading?: (loading: boolean) => void;
}

export default function ShiftsAssignmentStep({
  guard,
  guardDisplayInfo,
  ambulances,
  drivers,
  paramedics,
  shifts,
  onShiftAdded,
  onShiftRemoved,
  setIsLoading,
}: ShiftsAssignmentStepProps) {
  // (Component) Paso 2: Asignar turnos - [CSR]

  const initialState: ShiftState = { errors: {}, message: null };
  const [state, formAction, isLoading] = useActionState(
    createShift,
    initialState,
  );
  const [showForm, setShowForm] = useState(false);
  const [formReset, setFormReset] = useState(0);
  const lastHandledShiftIdRef = useRef<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsMounted(true), 20);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (state.shift && state.shift.id !== lastHandledShiftIdRef.current) {
      lastHandledShiftIdRef.current = state.shift.id;
      onShiftAdded(state.shift);
      toast.success("Turno asignado correctamente");
      setShowForm(false);
      setFormReset((prev) => prev + 1);
    }
  }, [state.shift, onShiftAdded]);

  useEffect(() => {
    state.errors?.success &&
      state.errors?.success.map((error: string) => toast.error(error));
  }, [state.errors?.success]);

  useEffect(() => {
    setIsLoading?.(isLoading);
  }, [isLoading]);

  return (
    <div className="space-y-6">
      {/* Guard Info */}
      <div
        className={`transition-all delay-75 duration-300 ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <GuardInfoCard
          guard={guard}
          display={guardDisplayInfo}
          title="Información de la Guardia"
        />
      </div>

      {/* Shifts List */}
      {shifts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">
            Turnos Asignados ({shifts.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shifts.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onRemove={() => onShiftRemoved(shift.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Shift Form */}
      {!showForm && (
        <Button
          type="button"
          onClick={() => setShowForm(true)}
          variant="formSecondary"
          additionalClassName="h-11 rounded-xl px-4 text-sm"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar Turno
        </Button>
      )}

      {showForm && (
        <form action={formAction} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Nuevo Turno
            </h4>

            <input
              type="text"
              name="guard"
              defaultValue={guard.id}
              className="hidden"
            />

            <FormSelect
              key={`ambulance-${formReset}`}
              name="ambulance"
              title="Ambulancia"
              options={[
                { id: "", label: "Seleccione Ambulancia", value: "" },
                ...ambulances,
              ]}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                key={`driver-${formReset}`}
                name="driver"
                title="Chofer"
                options={[
                  { id: "", label: "Seleccione Chofer", value: "" },
                  ...drivers,
                ]}
                required
              />

              <FormSelect
                key={`paramedic-${formReset}`}
                name="paramedical"
                title="Paramédico"
                options={[
                  { id: "", label: "Seleccione Paramédico", value: "" },
                  ...paramedics,
                ]}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setShowForm(false)}
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
                Guardar Turno
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Empty State */}
      {shifts.length === 0 && !showForm && (
        <div className="rounded-[28px] border border-dashed border-rose-200/80 bg-rose-50/20 p-6 shadow-[0_18px_38px_-30px_rgba(244,63,94,0.35)]">
          <div className="rounded-2xl bg-white/65 py-10 text-center backdrop-blur-[1px]">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium text-slate-500">
              No hay turnos asignados todavia
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ShiftCard({
  shift,
  onRemove,
}: {
  shift: ShiftType;
  onRemove: () => void;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_35px_-24px_rgba(15,23,42,0.45)]">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 text-slate-400 transition-colors hover:text-red-500"
        title="Eliminar turno"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="space-y-2 pr-6">
        <div>
          <p className="text-xs font-medium text-slate-500">Ambulancia</p>
          <p className="text-sm font-semibold text-slate-900">
            {shift.ambulance?.number}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500">Chofer</p>
            <p className="text-xs text-slate-700">{shift.driver?.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Paramédico</p>
            <p className="text-xs text-slate-700">{shift.paramedical?.name}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-2">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
            Asignado
          </span>
        </div>
      </div>
    </div>
  );
}
