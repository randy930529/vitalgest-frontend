"use client";

import { useEffect, useState } from "react";
import { CustomOptions, GuardType, ShiftType } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import GuardInfoCard, {
  GuardDisplayInfo,
} from "@/app/ui/dashboard/guards/create/guard-info-card";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ShiftAssignmentForm from "@/app/ui/dashboard/guards/create/steps/shift-assignment-form";

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

  const [isLoading, setLocalIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const editingShift = shifts.find((shift) => shift.id === editingShiftId);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsMounted(true), 20);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setIsLoading?.(isLoading);
  }, [isLoading, setIsLoading]);

  const handleCreateShift = () => {
    setEditingShiftId(null);
    setShowForm(true);
  };

  const handleEditShift = (shiftId: string) => {
    setEditingShiftId(shiftId);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingShiftId(null);
    setShowForm(false);
  };

  const handleSavedShift = () => {
    setEditingShiftId(null);
    setShowForm(false);
  };

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
                isEditing={editingShiftId === shift.id}
                onEdit={() => handleEditShift(shift.id)}
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
          onClick={handleCreateShift}
          variant="formSecondary"
          additionalClassName="h-11 rounded-xl px-4 text-sm"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Agregar Turno
        </Button>
      )}

      {showForm && (
        <ShiftAssignmentForm
          guardId={guard.id}
          shifts={shifts}
          ambulances={ambulances}
          drivers={drivers}
          paramedics={paramedics}
          editingShift={editingShift}
          onSaved={(savedShift) => {
            onShiftAdded(savedShift);
            handleSavedShift();
          }}
          onCancel={handleCancelForm}
          setIsLoading={setLocalIsLoading}
        />
      )}

      {/* Empty State */}
      {shifts.length === 0 && !showForm && (
        <div className="rounded-[28px] border border-dashed border-rose-200/80 bg-rose-50/20 p-6 shadow-[0_18px_38px_-30px_rgba(244,63,94,0.35)]">
          <div className="rounded-2xl bg-white/65 py-10 text-center backdrop-blur-[1px]">
            <CheckCircleIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
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
  isEditing,
  onEdit,
  onRemove,
}: {
  shift: ShiftType;
  isEditing?: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_35px_-24px_rgba(15,23,42,0.45)] ${
        isEditing ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200"
      }`}
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit();
        }
      }}
      title="Editar turno"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        className="absolute right-2 top-2 text-slate-400 transition-colors hover:text-red-500"
        title="Eliminar turno"
      >
        <XMarkIcon className="h-5 w-5" />
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
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
              Asignado
            </span>
            <span className="inline-flex items-center text-xs font-medium text-slate-500">
              <PencilSquareIcon className="mr-1 h-4 w-4" />
              Editar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
