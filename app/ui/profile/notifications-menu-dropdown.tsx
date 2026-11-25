"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { BellIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { CriticalSuppliesType, PendingOrdersType } from "@/app/lib/definitions";
import { CountBadge } from "@/app/ui/components/badges";

interface NotificationsMenuDropdownProps {
  buttonClassName?: string;
  criticalSupplies: CriticalSuppliesType[];
  criticalUnitCount: number;
  pendingOrders: PendingOrdersType[];
  pendingUnitCount: number;
  count: number;
}

export default function NotificationsMenuDropdown({
  buttonClassName,
  criticalSupplies,
  criticalUnitCount,
  pendingOrders,
  pendingUnitCount,
  count,
}: NotificationsMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cierra el menú si se hace clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Limpieza el event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const finalButtonClass = clsx(
    buttonClassName
      ? buttonClassName
      : "p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600",
  );

  return (
    <div ref={dropdownRef} className="relative z-[80]">
      <button
        id="notifications-menu-button"
        name="notifications"
        type="button"
        title="Menú de Notificaciones"
        className={finalButtonClass}
        aria-expanded="false"
        data-dropdown-toggle="notifications-menu-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="sr-only">View notifications</span>
        {/* <!-- Notifications icon --> */}
        <div className="container relative">
          <BellIcon className="relative w-8 h-8" />
          {count > 0 && <CountBadge count={count} variant="danger" />}
        </div>
      </button>
      {/* <!-- Dropdown menu --> */}
      <div
        id="notifications-menu-dropdown"
        className={clsx(
          "absolute right-0 top-full z-[90] mt-2 w-64 list-none divide-y divide-gray-100 rounded-xl bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700",
          {
            hidden: !isOpen,
          },
        )}
      >
        <CriticalSuppliesMenuItems
          criticalSupplies={criticalSupplies}
          criticalUnitCount={criticalUnitCount}
          setIsOpen={setIsOpen}
        />
        <PendingOrdersMenuItems
          pendingOrders={pendingOrders}
          pendingUnitCount={pendingUnitCount}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
}

function CriticalSuppliesMenuItems({
  criticalSupplies,
  criticalUnitCount,
  setIsOpen,
}: {
  criticalSupplies: CriticalSuppliesType[];
  criticalUnitCount: number;
  setIsOpen: (isOpen: boolean) => void;
}) {
  if (criticalSupplies.length === 0) return null;

  return (
    <>
      <div className="py-3 px-4">
        <p className="block text-sm font-semibold text-gray-900 dark:text-white">
          Insumos críticos
        </p>
        <p className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
          <CalendarIcon className="h-3 w-3" />
          {criticalUnitCount} unidad(es) con insumos críticos
        </p>
      </div>
      <ul
        className="py-1 text-gray-700 dark:text-gray-300"
        aria-labelledby="dropdown"
      >
        {criticalSupplies.map((item, index) => (
          <li
            key={`${item.ambulanceId}-${item.name}-${index}`}
            className="rounded-b-lg overflow-hidden"
          >
            <Link
              href={`/dashboard/supplies/ambulances?ambulance=${item.ambulanceId}&pharmacy=${item.pharmacyId}&supply=${item.supplyId}`}
              className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <p className="text-sm text-slate-700  dark:text-gray-400 dark:hover:text-white">
                {item.name} - Unidad {item.ambulanceNumber}
              </p>
              <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
                {item.deficit}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function PendingOrdersMenuItems({
  pendingOrders,
  pendingUnitCount,
  setIsOpen,
}: {
  pendingOrders: PendingOrdersType[];
  pendingUnitCount: number;
  setIsOpen: (isOpen: boolean) => void;
}) {
  if (pendingOrders.length === 0) return null;

  return (
    <>
      <div className="py-3 px-4">
        <p className="block text-sm font-semibold text-gray-900 dark:text-white">
          Pedidos pendientes
        </p>
        <p className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
          <CalendarIcon className="h-3 w-3" />
          {pendingUnitCount} unidad(es) con pedidos
        </p>
      </div>
      <ul
        className="py-1 text-gray-700 dark:text-gray-300"
        aria-labelledby="dropdown"
      >
        {pendingOrders.map((item, index) => (
          <li
            key={`${item.orderId}-${item.ambulanceNumber}-${index}`}
            className="rounded-b-lg overflow-hidden"
          >
            <Link
              href={`/dashboard/orders/${item.orderId}/details`}
              className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <p className="text-sm text-slate-700  dark:text-gray-400 dark:hover:text-white">
                {`Fecha: ${item.orderDate} - Unidad ${item.ambulanceNumber}`}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
