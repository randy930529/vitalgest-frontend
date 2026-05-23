"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import {
  EyeIcon,
  TruckIcon,
  DocumentTextIcon,
  LockClosedIcon,
  XMarkIcon,
  NumberedListIcon,
} from "@heroicons/react/24/outline";
import { GuardType } from "@/app/lib/definitions";
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
          const chkInsumos = shift.checklistSupplies;
          const chkAmbulancia = shift.checklistAmbulance;
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
                <div className="flex-1 bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-lg flex flex-col justify-between items-center gap-2">
                  <div>
                    <div className="font-semibold text-xs text-[#166534]">
                      Checklist de Insumos
                    </div>
                    <div className="text-xs text-[#15803d] mt-1">
                      Estado:{" "}
                      <strong>
                        {chkInsumos?.recipient_id ? "Completado" : "Pendiente"}
                      </strong>
                    </div>
                  </div>
                  {chkInsumos && (
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/guards/checklists/supplies/${chkInsumos.id}`}
                        className="bg-white text-emerald-700 border border-[#bbf7d0] px-3 py-1.5 rounded-md text-xs font-medium flex items-center"
                      >
                        <NumberedListIcon className="w-4 h-4 mr-1" />
                        {guard.state === "En curso" && chkInsumos.recipient_id
                          ? "Llenar Checklist"
                          : "Ver Detalles"}
                      </Link>
                      {chkInsumos.recipient_id && (
                        <Link
                          href={`/dashboard/guards/checklists/supplies/${chkInsumos.id}/report`}
                          className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md flex items-center"
                          title="Informe del Checklist Insumos"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  )}
                  {!chkInsumos && (
                    <span className="text-[0.8rem] text-[#ef4444]">
                      No generado
                    </span>
                  )}
                </div>

                <div className="flex-1 bg-[#eff6ff] border border-[#bfdbfe] p-4 rounded-lg flex flex-col justify-between items-center gap-2">
                  <div>
                    <div className="font-semibold text-xs text-[#1d4ed8]">
                      Checklist de Ambulancia
                    </div>
                    <div className="text-xs text-[#1e40af] mt-1">
                      Estado:{" "}
                      <strong>
                        {chkAmbulancia?.recipient ? "Completado" : "Pendiente"}
                      </strong>
                    </div>
                  </div>
                  {chkAmbulancia && (
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/guards/checklists/ambulance/${chkAmbulancia.id}`}
                        className="bg-white text-blue-700 border border-[#bfdbfe] px-3 py-1.5 rounded-md text-xs font-medium flex items-center"
                      >
                        <NumberedListIcon className="w-4 h-4 mr-1" />
                        {guard?.state === "En curso" && chkAmbulancia.recipient
                          ? "Llenar Checklist"
                          : "Ver Detalles"}
                      </Link>
                      {chkAmbulancia.recipient && (
                        <Link
                          href={`/dashboard/guards/checklists/ambulance/${chkAmbulancia.id}/report`}
                          className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md flex items-center"
                          title="Informe del Checklist de Ambulancia"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  )}
                  {!chkAmbulancia && (
                    <span className="text-[0.8rem] text-[#ef4444]">
                      No generado
                    </span>
                  )}
                </div>
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
