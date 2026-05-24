import Link from "next/link";
import clsx from "clsx";
import {
  CalendarIcon,
  PencilIcon,
  TruckIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { ShiftType, ToneVariants, UserType } from "@/app/lib/definitions";
import { getElapsedMessage } from "@/app/lib/utils";
import { Button } from "@/app/ui/button";
import { Badge, BadgeVariant } from "@/app/ui/components/badges";
import { StatCardProps } from "@/app/ui/dashboard/cards";

const toneClasses: Record<
  string,
  {
    softBg: string;
    softText: string;
    iconBg: string;
    iconText: string;
  }
> = {
  purple: {
    softBg: "bg-violet-50",
    softText: "text-violet-700",
    iconBg: "bg-violet-100",
    iconText: "text-violet-700",
  },
  blue: {
    softBg: "bg-sky-50",
    softText: "text-sky-700",
    iconBg: "bg-sky-100",
    iconText: "text-sky-700",
  },
  green: {
    softBg: "bg-emerald-50",
    softText: "text-emerald-700",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
  },
  red: {
    softBg: "bg-rose-50",
    softText: "text-rose-700",
    iconBg: "bg-rose-100",
    iconText: "text-rose-700",
  },
};

export function CardWrapper({
  children,
  isColumn,
  controllers,
}: {
  children: React.ReactNode;
  isColumn?: boolean;
  controllers?: boolean;
}) {
  return (
    <div className="relative bg-gray-200 border border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
      {controllers && (
        <div className="flex justify-end px-4">
          <Button className="absolute top-2 right-2 rounded-md border p-2 bg-white hover:bg-gray-300">
            <PencilIcon className="w-5 h-5" />
          </Button>
        </div>
      )}
      <div
        className={clsx("flex items-center", {
          "flex-col md:items-start": isColumn,
        })}
      >
        {children}
      </div>
    </div>
  );
}

export function CardsGroup({ children }: { children: React.ReactNode }) {
  return <section className="overflow-x-auto rounded-lg">{children}</section>;
}

export function CardShift({ shift }: { shift: ShiftType }) {
  return (
    <div className="flex flex-col pr-8">
      <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
        {shift.name ? shift.name : shift.ambulance.number}
      </h3>
      <p className="text-xs">
        <span>Chofer: </span>
        {`${shift.driver?.name || ""} ${shift.driver?.lastname || ""}`}
      </p>
      <p className="text-xs">
        <span>Paramédico: </span>
        {`${shift.paramedical?.name || ""} ${
          shift.paramedical?.lastname || ""
        }`}
      </p>
    </div>
  );
}

export function ResourceCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  const tone = toneClasses[color] ?? toneClasses.blue;

  return (
    <div
      className={clsx(
        "min-w-20 rounded-xl border border-slate-200 px-4 py-3 text-center md:min-w-24",
        tone.softBg,
      )}
    >
      <Icon className={clsx("mx-auto mb-1 h-5 w-5", tone.softText)} />
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p
        className={clsx(
          "hidden text-[11px] font-medium md:block",
          tone.softText,
        )}
      >
        {title}
      </p>
    </div>
  );
}

export function ShiftCard({
  title,
  value,
  icon: Icon,
  color,
  ambulanceNumber,
  driver,
  paramedical,
}: StatCardProps & {
  ambulanceNumber: string;
  driver: UserType;
  paramedical: UserType;
}) {
  const tone = toneClasses[color] ?? toneClasses.purple;
  const timeElapsed = getElapsedMessage(new Date(value), new Date());
  const driverName = fullName(driver.name, driver.lastname);
  const paramedicalName = fullName(paramedical.name, paramedical.lastname);

  function fullName(name: string, lastname: string) {
    const [firstName, secondName = ""] = name.split(" ");
    const [firstLastname, secondLastname = ""] = lastname.split(" ");
    return `${firstName} ${secondName[0] ? secondName[0] + ". " : ""} ${
      firstLastname[0] + "."
    } ${secondLastname}`;
  }

  return (
    <div className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-full",
            tone.iconBg,
          )}
        >
          <Icon className={clsx("h-5 w-5", tone.iconText)} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <CalendarIcon className="w-3 h-3" />
            <span>{timeElapsed}</span>
          </div>
        </div>
      </div>
      <TeamCard
        ambulanceNumber={ambulanceNumber}
        driverName={driverName}
        paramedicalName={paramedicalName}
        color={color}
      />
    </div>
  );
}

export function TeamCard({
  ambulanceNumber,
  driverName,
  paramedicalName,
  color,
}: {
  ambulanceNumber: string;
  driverName: string;
  paramedicalName: string;
  color: string;
}) {
  const tone = toneClasses[color] ?? toneClasses.purple;

  return (
    <>
      <p className="flex gap-2 font-light">
        <span>
          <TruckIcon className={clsx("mx-auto mb-1 h-5 w-5", tone.iconText)} />
        </span>
        {ambulanceNumber}
      </p>
      <div className="flex flex-col items-start text-xs font-medium">
        <span>
          <UsersIcon className={`w-5 h-5 text-blue-600 mx-auto mb-1`} />
        </span>
        <p>
          Chofer: <span className="font-normal uppercase">{driverName}</span>
        </p>
        <p>
          Paramédico:{" "}
          <span className="font-normal uppercase">{paramedicalName}</span>
        </p>
      </div>
    </>
  );
}

export function ChecklistsLinkCard({
  title,
  link,
  guardId,
  id,
  isChecked,
  param = "create",
}: {
  title: string;
  link: string;
  guardId: string;
  id: string;
  isChecked?: boolean;
  param?: string;
}) {
  const checklistStatus = isChecked ? "Finalizado" : "Pendiente";
  const checklistUrl = link
    ? `/checklists/${guardId}/${link}/${id}/${param}`
    : "#";

  return (
    <div className="flex flex-col gap-2 rounded-lg p-2 shadow-md transition-shadow hover:shadow-lg">
      {isChecked || !link ? (
        <span
          className="rounded-lg p-2 text-xs font-medium text-slate-500"
          aria-label={`${title} completado`}
        >
          {title}
        </span>
      ) : (
        <Link
          className="rounded-lg p-2 text-xs font-medium text-blue-600 transition hover:text-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          href={checklistUrl}
          aria-label={`Abrir ${title}`}
        >
          {title}
          <ArrowRightIcon className="mx-2 inline-block h-4 w-4" />
        </Link>
      )}
      <div className="mx-2">
        <Badge
          title={checklistStatus}
          success={isChecked}
          pending={param.startsWith("edit")}
        />
      </div>
    </div>
  );
}

export function AlertCard({
  title,
  subtitle,
  alertType,
  alertIcon: Icon,
  badge,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  alertType: ToneVariants;
  alertIcon?: React.ElementType;
  badge?: { text: string; type: BadgeVariant };
  children?: React.ReactNode;
}) {
  const alertTone = {
    success: "emerald",
    warning: "orange",
    danger: "rose",
    neutral: "slate",
    default: "sky",
  }[alertType];

  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-2xl border p-4",
        `bg-${alertTone}-50/70 border-${alertTone}-200`,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            `bg-${alertTone}-100 text-${alertTone}-600`,
          )}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{title}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            {subtitle}
          </div>
        </div>
      </div>
      {badge && (
        <Badge
          title={badge.text}
          variant={badge.type}
          extraClassName="bg-white"
        />
      )}
      {children}
    </div>
  );
}

export function SummaryCard({
  title,
  subtitle,
  summaryType,
  summaryIcon: Icon,
}: {
  title: string;
  subtitle?: string;
  summaryType: ToneVariants;
  summaryIcon?: React.ElementType;
}) {
  const summaryTone = {
    success: "emerald",
    warning: "orange",
    danger: "rose",
    neutral: "slate",
    default: "sky",
  }[summaryType];

  return (
    <div
      className={clsx(
        "rounded-2xl border p-3 text-center",
        `border-${summaryTone}-100 bg-${summaryTone}-50/70 text-${summaryTone}-600`,
      )}
    >
      {Icon && <Icon className="mx-auto mb-1 h-5 w-5" />}
      <p className={clsx("text-2xl font-semibold", `text-${summaryTone}-900`)}>
        {title}
      </p>
      {subtitle && (
        <p className={clsx("text-xs font-medium", `text-${summaryTone}-700`)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
