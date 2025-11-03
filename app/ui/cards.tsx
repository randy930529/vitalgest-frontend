import clsx from "clsx";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ShiftType } from "@/app/lib/definitions";
import { Button } from "./button";

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
