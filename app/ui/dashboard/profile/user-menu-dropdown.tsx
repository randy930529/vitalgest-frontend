"use client";

import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import clsx from "clsx";
import { UserIcon } from "@heroicons/react/24/outline";
import { LinkSignout } from "@/app/ui/button-signout";

export default function UserMenuDropdown({
  id,
  email,
  name,
  lastname,
}: {
  id: string;
  email: string;
  name: string;
  lastname: string;
}) {
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

  return (
    <div ref={dropdownRef}>
      <button
        id="user-menu-button"
        name="user"
        type="button"
        className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        aria-expanded="false"
        data-tooltip-id="user-menu-tooltip"
        data-dropdown-toggle="user-menu-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="sr-only">Open user menu</span>
        {/* <!-- User icon --> */}
        <UserIcon className="w-8 h-8" />
        <Tooltip id="user-menu-tooltip" content="Menú de Usuario" />
      </button>
      {/* <!-- Dropdown menu --> */}
      <div
        id="user-menu-dropdown"
        className={clsx(
          "dropdown-open absolute top-0 z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl",
          {
            hidden: !isOpen,
          }
        )}
      >
        <div className="py-3 px-4">
          <span className="block text-sm font-semibold text-gray-900 dark:text-white">
            {`${name} ${lastname}`}
          </span>
          <span className="block text-sm text-gray-900 truncate dark:text-white">
            {email}
          </span>
        </div>
        <ul
          className="py-1 text-gray-700 dark:text-gray-300"
          aria-labelledby="dropdown"
        >
          <li>
            <a
              href="#"
              className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
            >
              Mi perfil
            </a>
          </li>
        </ul>
        <ul
          className="py-1 text-gray-700 dark:text-gray-300"
          aria-labelledby="dropdown"
        >
          <li>
            <LinkSignout key={`user-dropdown-${id}`} />
          </li>
        </ul>
      </div>
    </div>
  );
}
