"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CustomOptions,
  DelegationType,
  GuardType,
  ShiftType,
  StepItemType,
} from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { GuardDisplayInfo } from "./guard-info-card";
import StepIndicator from "./step-indicator";
import GuardCreationStep from "./steps/guard-creation-step";
import ShiftsAssignmentStep from "./steps/shifts-assignment-step";
import GuardSummaryStep from "./steps/guard-summary-step";

type WizardStepType = 1 | 2 | 3;

export default function GuardCreationWizard({
  guardChiefs,
  delegations,
  ambulances,
  drivers,
  paramedicals,
  onClose,
}: {
  guardChiefs: CustomOptions[];
  delegations: DelegationType[];
  ambulances: CustomOptions[];
  drivers: CustomOptions[];
  paramedicals: CustomOptions[];
  onClose?: () => void;
}) {
  // (Component) Asistente de creación de guardias - [CSR]

  const [currentStep, setCurrentStep] = useState<WizardStepType>(1);
  const [guard, setGuard] = useState<GuardType | null>(null);
  const [guardDisplayInfo, setGuardDisplayInfo] =
    useState<GuardDisplayInfo>();
  const [shifts, setShifts] = useState<ShiftType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepContentVisible, setIsStepContentVisible] = useState(false);

  useEffect(() => {
    setIsStepContentVisible(false);
    const timeoutId = setTimeout(() => setIsStepContentVisible(true), 30);

    return () => clearTimeout(timeoutId);
  }, [currentStep]);

  const steps: StepItemType[] = [
    {
      id: 1,
      label: "Crear Guardia",
      details: "Información básica",
      status: guard ? "completed" : "pending",
    },
    {
      id: 2,
      label: "Asignar Turnos",
      details: "Ambulancias y personal",
      status:
        guard && shifts.length > 0
          ? "completed"
          : guard
            ? "pending"
            : "pending",
    },
    {
      id: 3,
      label: "Resumen",
      details: "Confirmación final",
      status:
        guard && shifts.length > 0 ? "pending" : guard ? "pending" : "pending",
    },
  ];

  const handleNextStep = () => {
    if (currentStep === 1 && !guard) {
      toast.error("Debes crear la guardia primero");
      return;
    }
    if (currentStep === 2 && shifts.length === 0) {
      toast.error("Debes asignar al menos un turno");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as WizardStepType);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStepType);
    }
  };

  const handleGuardCreated = (
    newGuard: GuardType,
    displayInfo?: GuardDisplayInfo,
  ) => {
    setGuard(newGuard);
    setGuardDisplayInfo(displayInfo);
    setCurrentStep(2);
  };

  const handleShiftAdded = (newShift: ShiftType) => {
    setShifts((prev) => {
      if (prev.some((shift) => shift.id === newShift.id)) {
        return prev;
      }
      return [...prev, newShift];
    });
  };

  const handleShiftRemoved = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    toast.success("Turno eliminado");
  };

  const handleWizardComplete = () => {
    toast.success("¡Guardia creada exitosamente!");
    onClose?.();
  };

  return (
    <div className="w-full space-y-6 rounded-[24px] border border-white/80 bg-white/90 p-4 pt-0 backdrop-blur-sm sm:p-6 sm:pt-0">
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-blue-50/70 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex max-w-max items-center rounded-full border border-primary-100 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)] bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          Paso {currentStep} de {steps.length}
        </span>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        steps={steps}
        currentStepId={currentStep}
        progress={((currentStep - 1) / (steps.length - 1)) * 100}
      />

      {/* Step Content */}
      <div
        className={`rounded-2xl border border-slate-100 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)] bg-white p-4 transition-all duration-300 ease-out sm:p-5 ${
          isStepContentVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        {currentStep === 1 && (
          <GuardCreationStep
            guardChiefs={guardChiefs}
            delegations={delegations}
            onGuardCreated={handleGuardCreated}
            existingGuard={guard || undefined}
            existingDisplayInfo={guardDisplayInfo}
            isLoading={isLoading}
          />
        )}

        {currentStep === 2 && guard && (
          <ShiftsAssignmentStep
            guard={guard}
            guardDisplayInfo={guardDisplayInfo}
            ambulances={ambulances}
            drivers={drivers}
            paramedics={paramedicals}
            shifts={shifts}
            onShiftAdded={handleShiftAdded}
            onShiftRemoved={handleShiftRemoved}
            isLoading={isLoading}
          />
        )}

        {currentStep === 3 && guard && (
          <GuardSummaryStep
            guard={guard}
            guardDisplayInfo={guardDisplayInfo}
            shifts={shifts}
            onComplete={handleWizardComplete}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
        <Button
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          variant="formSecondary"
          additionalClassName="h-11 rounded-xl px-4 text-sm"
        >
          ← Anterior
        </Button>

        <Button
          onClick={() => onClose?.()}
          variant="formSecondary"
          additionalClassName="h-11 rounded-xl px-4 text-sm"
        >
          Cancelar
        </Button>

        {currentStep < 3 && (
          <Button
            onClick={handleNextStep}
            disabled={
              (currentStep === 1 && !guard) ||
              (currentStep === 2 && shifts.length === 0) ||
              isLoading
            }
            variant="formPrimary"
            additionalClassName="h-11 rounded-xl px-5 text-sm"
          >
            Siguiente →
          </Button>
        )}
      </div>
    </div>
  );
}
