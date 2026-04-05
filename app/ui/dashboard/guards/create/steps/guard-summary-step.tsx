"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  CheckCircleIcon,
  TruckIcon,
  UserGroupIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { GuardType, ShiftType } from "@/app/lib/definitions";
import GuardInfoCard, {
  GuardDisplayInfo,
} from "@/app/ui/dashboard/guards/create/guard-info-card";

interface GuardSummaryStepProps {
  guard: GuardType;
  guardDisplayInfo?: GuardDisplayInfo;
  shifts: ShiftType[];
  onComplete: () => void;
}

export default function GuardSummaryStep({
  guard,
  guardDisplayInfo,
  shifts,
  onComplete,
}: GuardSummaryStepProps) {
  // (Component) Paso 3: Resumen de guardia - [CSR]
  const [isMounted, setIsMounted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsMounted(true), 20);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  const handleCompleteClick = () => {
    if (isCompleting) {
      return;
    }

    setIsCompleting(true);
    completionTimeoutRef.current = setTimeout(() => {
      onComplete();
    }, 650);
  };

  return (
    <div className="space-y-6">
      {/* Guard Summary Card */}
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

      {/* Shifts Summary */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Turnos Asignados</h3>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
            {shifts.length}
          </span>
        </div>

        {shifts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shifts.map((shift, index) => (
              <ShiftSummaryCard
                key={shift.id}
                shift={shift}
                index={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
            <p className="text-slate-500">Sin turnos asignados</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Ambulancias"
          value={shifts.length}
          icon={<TruckIcon className="h-7 w-7" />}
          color="blue"
        />
        <StatCard
          label="Conductores"
          value={new Set(shifts.map((s) => s.driver?.id)).size}
          icon={<UserGroupIcon className="h-7 w-7" />}
          color="green"
        />
        <StatCard
          label="Paramédicos"
          value={new Set(shifts.map((s) => s.paramedical?.id)).size}
          icon={<HeartIcon className="h-7 w-7" />}
          color="purple"
        />
      </div>

      {/* Confirmation Message */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          Una vez confirmes la creación, la guardia estará activa en el sistema.
          Puedes editar los turnos después si es necesario.
        </p>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleCompleteClick}
          disabled={isCompleting}
          className={`inline-flex min-w-[210px] items-center justify-center rounded-xl px-8 py-3 text-center text-sm font-semibold text-white transition ${
            isCompleting
              ? "cursor-not-allowed bg-emerald-500 shadow-[0_20px_35px_-20px_rgba(16,185,129,0.75)]"
              : "bg-emerald-600 shadow-[0_20px_35px_-20px_rgba(5,150,105,0.7)] hover:bg-emerald-700 hover:shadow-[0_25px_40px_-20px_rgba(5,150,105,0.8)]"
          }`}
        >
          {isCompleting ? (
            <>
              <span className="relative mr-2 inline-flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-white"></span>
              </span>
              Confirmando...
            </>
          ) : (
            <>
              <CheckCircleIcon className="mr-2 h-5 w-5" />
              Confirmar y Finalizar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface ShiftSummaryCardProps {
  shift: ShiftType;
  index: number;
}

function ShiftSummaryCard({ shift, index }: ShiftSummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_35px_-24px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
          {index}
        </span>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          Turno operativo
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ambulancia
          </p>
          <p className="text-sm font-bold text-slate-900">
            <span className="inline-flex items-center gap-1">
              <TruckIcon className="h-4 w-4" />
              {shift.ambulance?.number}
            </span>
          </p>
          {shift.ambulance?.brand && (
            <p className="text-xs text-slate-600">
              {shift.ambulance.brand} {shift.ambulance.model}
            </p>
          )}
        </div>

        <div className="border-t border-slate-200 pt-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-semibold text-slate-500">Chofer</p>
              <p className="text-slate-700">{shift.driver?.name}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500">Paramédico</p>
              <p className="text-slate-700">{shift.paramedical?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  color: "blue" | "green" | "purple";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
};

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 p-4 ${colorMap[color]}`}
    >
      <div className="mb-2">{icon}</div>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
