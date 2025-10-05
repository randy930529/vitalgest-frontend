"use client";

import clsx from "clsx";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const customLinksMenu = [
  { id: 1, value: "/dashboard/users", label: "Gestion de Usuarios" },
  { id: 2, value: "#", label: "Modificar Información" },
];

export default function MenuOptionsDropdown({
  hiddenDropdown,
  setHiddenDropdown,
}: {
  hiddenDropdown: boolean;
  setHiddenDropdown: (e: any, value: boolean) => void;
}) {
  return (
    <>
      <button
        id="menu-optios-button"
        name="options"
        type="button"
        className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        aria-expanded="false"
        data-dropdown-toggle="options-menu-dropdown"
        onClick={(e) => setHiddenDropdown(e.currentTarget, !hiddenDropdown)}
      >
        <span className="sr-only">View options</span>
        {/* <!-- Cog icon --> */}
        <Cog6ToothIcon className="w-8 h-8" />
      </button>
      {/* <!-- Dropdown Options menu --> */}
      <div
        id="user-menu-dropdown"
        className={clsx(
          "dropdown-open_menu_options absolute top-0 z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl",
          {
            hidden: hiddenDropdown,
          }
        )}
      >
        <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300">
          Opciones
        </div>
        <ul
          className="py-1 text-gray-700 dark:text-gray-300"
          aria-labelledby="dropdown"
        >
          {customLinksMenu.map(({ id, value, label }) => (
            <li key={`menu-options-li-${id}`}>
              <Link
                key={`menu-options-link-${id}`}
                href={value}
                className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
