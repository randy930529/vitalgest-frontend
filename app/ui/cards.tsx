import Link from "next/link";
import clsx from "clsx";
import { ShiftType } from "@/app/lib/definitions";

export function CardWrapper({
  children,
  isColumn,
}: {
  children: React.ReactNode;
  isColumn?: boolean;
}) {
  return (
    <div className="w-full bg-gray-200 border border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
      <div className="flex justify-end px-4">{/* TODO: Dropdown menu */}</div>
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

export function CardShift({ shift }: { shift: ShiftType }) {
  return (
    <>
      <h3 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
        {shift.name ? shift.name : shift.ambulance.number}
      </h3>
      <div className="flex mt-4 md:mt-6">
        <Link
          href="#"
          className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Message
        </Link>
        <Link
          href="#"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add friend
        </Link>
      </div>
    </>
  );
}
