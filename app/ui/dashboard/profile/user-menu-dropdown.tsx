"use client";

import clsx from "clsx";
import { UserIcon } from "@heroicons/react/24/outline";
import { LinkSignout } from "../../button-signout";

export default function UserMenuDropdown({
  id,
  email,
  name,
  lastname,
  hiddenDropdown,
  setHiddenDropdown,
}: {
  id: string;
  email: string;
  name: string;
  lastname: string;
  hiddenDropdown: boolean;
  setHiddenDropdown: (e: any, value: boolean) => void;
}) {
  return (
    <>
      <button
        id="user-menu-button"
        name="user"
        type="button"
        className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        aria-expanded="false"
        data-dropdown-toggle="user-menu-dropdown"
        onClick={(e) => setHiddenDropdown(e.currentTarget, !hiddenDropdown)}
      >
        <span className="sr-only">Open user menu</span>
        {/* <!-- User icon --> */}
        <UserIcon className="w-8 h-8" />
      </button>
      {/* <!-- Dropdown menu --> */}
      <div
        id="user-menu-dropdown"
        className={clsx(
          "dropdown-open absolute top-0 z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl",
          {
            hidden: hiddenDropdown,
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
    </>
  );
}
