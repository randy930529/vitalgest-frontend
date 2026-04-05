import type { ReactNode } from "react";
import { GuardType } from "@/app/lib/definitions";
import { formatDateToDDMMYYYY } from "@/app/lib/utils";
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export type GuardDisplayInfo = {
  delegationName?: string;
  guardChiefName?: string;
  date?: string;
  state?: string;
};

export default function GuardInfoCard({
  guard,
  display,
  title = "Información de la Guardia",
}: {
  guard: GuardType;
  display?: GuardDisplayInfo;
  title?: string;
}) {
  const delegationName =
    guard?.delegation?.name || display?.delegationName || "-";

  const chiefNameFromGuard = [
    guard?.guardChief?.name,
    guard?.guardChief?.lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const guardChiefName =
    chiefNameFromGuard || display?.guardChiefName || "Sin asignar";

  const rawDate = guard?.date || display?.date;
  const date = rawDate ? formatDateToDDMMYYYY(rawDate) : "-";

  const state = guard?.state || display?.state || "Nueva";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_22px_45px_-34px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50/80 px-4">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InfoItem
          label="Delegacion"
          value={delegationName}
          icon={<BuildingOffice2Icon className="h-4 w-4 text-slate-500" />}
        />
        <InfoItem
          label="Jefe de Guardia"
          value={guardChiefName}
          icon={<UserCircleIcon className="h-4 w-4 text-slate-500" />}
        />
        <InfoItem
          label="Fecha"
          value={date}
          icon={<CalendarDaysIcon className="h-4 w-4 text-slate-500" />}
        />
        <InfoItem
          label="Estado"
          icon={<CheckIcon className="h-4 w-4 text-slate-500" />}
        >
          <p className="w-max rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            {state}
          </p>
        </InfoItem>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value?: string;
  icon: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-slate-500">
        {icon}
        {label}
      </p>
      {value && (
        <p className="text-base font-semibold leading-tight text-slate-900">
          {value}
        </p>
      )}
      {children}
    </div>
  );
}
