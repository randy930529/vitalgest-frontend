"use client";

import { StepItemType } from "@/app/lib/definitions";
import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface StepIndicatorProps {
  steps: StepItemType[];
  currentStepId: number;
  progress?: number;
  showStatus?: boolean;
}

export default function StepIndicator({
  steps,
  currentStepId,
  progress = 0,
  showStatus = true,
}: StepIndicatorProps) {
  // (Component) Indicador visual de pasos - [CSR]

  return (
    <div className="w-full space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)]">
      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-1 items-center last:flex-none"
          >
            {/* Step Circle */}
            <div
              className={clsx(
                "relative flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full text-sm font-semibold leading-none transition-all",
                {
                  "bg-blue-700 text-white shadow-[0_15px_30px_-18px_rgba(29,78,216,0.9)]":
                    currentStepId === step.id,
                  "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200":
                    step.status === "completed",
                  "bg-slate-200 text-slate-500":
                    step.status !== "completed" && currentStepId !== step.id,
                },
              )}
            >
              {step.status === "completed" ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "mx-2 hidden h-1 w-full rounded-full sm:block",
                  {
                    "bg-emerald-500": steps[index].status === "completed",
                    "bg-slate-200": steps[index].status !== "completed",
                  },
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs sm:text-sm">
        {steps.map((step) => (
          <div
            key={step.id}
            className={clsx("text-center flex-1 px-1", {
              "text-blue-700 font-semibold": currentStepId === step.id,
              "text-emerald-700": step.status === "completed",
              "text-slate-500":
                currentStepId !== step.id && step.status !== "completed",
            })}
          >
            <p className="font-medium">{step.label}</p>
            {showStatus && step.details && (
              <p
                className={clsx("hidden text-xs sm:block", {
                  "text-blue-500": currentStepId === step.id,
                  "text-emerald-500": step.status === "completed",
                  "text-slate-400":
                    currentStepId !== step.id && step.status !== "completed",
                })}
              >
                {step.details}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
