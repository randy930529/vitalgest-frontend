import Link from "next/link";
import clsx from "clsx";
import {
  CalendarIcon,
  PencilIcon,
  TruckIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { ShiftType, UserType } from "@/app/lib/definitions";
import { getElapsedMessage } from "@/app/lib/utils";
import { Button } from "@/app/ui/button";
import { Badge } from "@/app/ui/badges";
import { StatCardProps } from "@/app/ui/dashboard/cards";

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
  return (
    <div className={`text-center px-8 py-3 bg-${color}-50 rounded-lg md:p-3`}>
      <Icon className={`w-5 h-5 text-${color}-600 mx-auto mb-1`} />
      <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
      <p className={`hidden text-xs text-${color}-600 md:block`}>{title}</p>
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
    <div className="flex flex-col gap-1 justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 text-${color}-600`} />
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
        color="purple"
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
  return (
    <>
      <p className="flex gap-2 font-light">
        <span>
          <TruckIcon className={`w-5 h-5 text-${color}-600 mx-auto mb-1`} />
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
    <div className="flex flex-col gap-2 rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow">
      <Link
        className="rounded-lg font-medium text-xs text-blue-500 p-2 dark:text-blue-500 hover:text-blue-700 hover:shadow-lg transition-shadow"
        href={checklistUrl}
      >
        {title}
        <ArrowRightIcon className="mx-2 inline-block w-4 h-4" />
      </Link>
      <div className="mx-2">
        <Badge
          title={checklistStatus}
          success={isChecked}
          pending={param === "edit"}
        />
      </div>
    </div>
  );
}
