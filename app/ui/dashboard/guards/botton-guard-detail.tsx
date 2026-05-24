"use client";

import { startTransition, useActionState } from "react";
import clsx from "clsx";
import Link from "next/link";
import {
  EyeIcon,
  TruckIcon,
  DocumentTextIcon,
  LockClosedIcon,
  XMarkIcon,
  NumberedListIcon,
} from "@heroicons/react/24/outline";
import {
  CheckListAmbulanceType,
  CheckListSupplyType,
  GuardType,
} from "@/app/lib/definitions";
import { closeGuard, initGuard } from "@/app/lib/actions/guard";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import ModalTrigger from "@/app/ui/button-modal";
import { Button } from "@/app/ui/button";

export function TableActionDetail({
  guard,
  title,
  details,
  onClose,
}: {
  guard: GuardType;
  title: string;
  details?: string;
  onClose?: () => void;
}) {
  return (
    <ModalTrigger
      title={title}
      type="info"
      details={details}
      modelContent={<GuardDetail guard={guard} onClose={onClose} />}
      buttonToggle={<ButtonToggleDetail />}
    />
  );
}

function GuardDetail({
  guard,
  onClose,
}: {
  guard: GuardType;
  onClose?: () => void;
}) {
  const initialState = { errors: {}, message: null };

  const closeGuardAction = closeGuard.bind(null, guard.id, guard);
  const initGuardAction = initGuard.bind(null, guard.id, guard);

  const [stateClosed, actionCloseGuard, isLoadingClosed] = useActionState(
    closeGuardAction,
    initialState,
  );
  const [stateInitialized, actionInitGuard, isLoadingInitialized] =
    useActionState(initGuardAction, initialState);

  useFormNotifications({
    state: stateInitialized,
  });
  useFormNotifications({
    state: stateClosed,
  });

  function handleCloseGuard() {
    startTransition(() => {
      actionCloseGuard();
    });
  }

  function handleInitGuard() {
    startTransition(() => {
      actionInitGuard();
    });
  }

  return (
    <section className="w-full  p-0">
      <div className="p-6">
        <div className="flex gap-8 mb-8">
          <div>
            <p className="text-xs text-slate-500 mb-1">Fecha Programada</p>
            <p className="text-xs font-semibold py-1">
              {new Date(guard.date).toLocaleDateString("es-MX", {
                timeZone: "UTC",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Jefe de Guardia</p>
            <p className="text-xs font-semibold py-1">
              {guard.guardChief.name} {guard.guardChief.lastname}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Estado</p>
            <span
              className={
                `font-semibold text-xs px-2 py-1 rounded uppercase ` +
                (guard.state === "En curso"
                  ? "text-amber-700 bg-amber-50"
                  : guard.state === "Cerrada"
                    ? "text-rose-700 bg-rose-50"
                    : "text-emerald-700 bg-emerald-50")
              }
            >
              {guard.state}
            </span>
          </div>
        </div>

        <h4 className="font-semibold text-sm border-b dark:border-gray-600 pb-2 mb-4">
          Ambulancias y Checklists
        </h4>

        {guard.shifts.map((shift) => {
          const chkSupplies = shift.checklistSupplies;
          const chkAmbulance = shift.checklistAmbulance;
          return (
            <div
              key={shift.id}
              className="border dark:border-gray-600 rounded-lg p-4 bg-[#fdfdfd]"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold text-xs flex items-center">
                  <TruckIcon className="inline-block w-4 h-4 mr-2 text-slate-500" />
                  Ambulancia {shift.ambulance.number}
                </div>
                <div className="text-xs text-slate-500">
                  Op: {shift.driver.name} | TUM: {shift.paramedical.name}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <ChecklistCard
                  key={chkSupplies?.id || "chkSupplies"}
                  typeChecklist="supplies"
                  checklist={chkSupplies}
                  guardState={guard.state}
                />
                <ChecklistCard
                  key={chkAmbulance?.id || "chkAmbulancia"}
                  typeChecklist="ambulance"
                  checklist={chkAmbulance}
                  guardState={guard.state}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        {guard.state === "Nueva" && (
          <Button
            type="submit"
            variant="formPrimary"
            onClick={handleInitGuard}
            disabled={isLoadingInitialized}
            isLoading={isLoadingInitialized}
          >
            Iniciar Guardia
          </Button>
        )}
        {guard.state === "En curso" && (
          <Button
            type="submit"
            variant="formPrimary"
            onClick={handleCloseGuard}
            disabled={isLoadingClosed}
            isLoading={isLoadingClosed}
          >
            <span className="inline-flex">
              <LockClosedIcon className="w-4 h-4 mr-1" />
            </span>
            Cerrar Guardia
          </Button>
        )}

        {guard.state === "Cerrada" && (
          <Link
            href={`/dashboard/guards/${guard?.id}/dossier`}
            className="action-btn bg-blue-500 text-white px-6 py-2 rounded-md font-medium no-underline"
          >
            Ver Informe Consolidado
          </Link>
        )}
        <Button type="reset" variant="formSecondary" onClick={onClose}>
          <span className="inline-flex">
            <XMarkIcon className="w-4 h-4 mr-1" />
          </span>
          Cerrar
        </Button>
      </div>
    </section>
  );
}

function ButtonToggleDetail({ onClose }: { onClose?: () => void }) {
  return (
    <button
      type="submit"
      className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-300 bg-sky-50 text-sky-700 transition hover:bg-sky-100"
      onClick={onClose}
      aria-label="Detalles del registro"
    >
      <span className="sr-only">Detalles</span>
      <EyeIcon className="w-4" />
    </button>
  );
}

function ChecklistCard({
  typeChecklist,
  checklist,
  guardState,
}: {
  typeChecklist: "ambulance" | "supplies";
  checklist: CheckListSupplyType | CheckListAmbulanceType | undefined;
  guardState: GuardType["state"];
}) {
  const isChkAmbulance = typeChecklist === "ambulance";

  return (
    <div
      className={clsx(
        "flex-1 p-4 rounded-lg",
        isChkAmbulance
          ? "bg-[#eff6ff] border-[#bfdbfe]"
          : "bg-[#f0fdf4] border-[#bbf7d0]",
        "border",
      )}
    >
      <div>
        <div
          className={clsx(
            "font-semibold text-xs",
            isChkAmbulance ? "text-[#1d4ed8]" : "text-[#166534]",
          )}
        >
          {isChkAmbulance ? "Checklist de Ambulancia" : "Checklist de Insumos"}
        </div>
        <div
          className={clsx(
            "text-xs mt-1",
            isChkAmbulance ? "text-[#1e40af]" : "text-[#15803d]",
          )}
        >
          Estado:{" "}
          <strong>
            {checklist?.sign_recipient_path ? "Completado" : "Pendiente"}
          </strong>
        </div>
      </div>
      {checklist && (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/guards/checklists/${typeChecklist}/${checklist.id}`}
            className={clsx(
              "bg-white border px-3 py-1.5 rounded-md text-xs font-medium flex items-center",
              isChkAmbulance
                ? "text-blue-700 border-[#bfdbfe]"
                : "text-emerald-700 border-[#bbf7d0]",
            )}
          >
            <NumberedListIcon className="w-4 h-4 mr-1" />
            {guardState === "En curso" && checklist.sign_recipient_path
              ? "Llenar Checklist"
              : "Ver Detalles"}
          </Link>
          {checklist.sign_recipient_path && (
            <Link
              href={`/dashboard/guards/checklists/${typeChecklist}/${checklist.id}/report`}
              className={clsx(
                "bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md flex items-center",
                isChkAmbulance
                  ? "text-blue-700 border-[#bfdbfe]"
                  : "text-emerald-700 border-[#bbf7d0]",
              )}
              title={
                isChkAmbulance
                  ? "Informe del Checklist de Ambulancia"
                  : "Informe del Checklist de Insumos"
              }
            >
              <DocumentTextIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
      {!checklist && (
        <span className="text-[0.8rem] text-[#ef4444]">No generado</span>
      )}
    </div>
  );
}
