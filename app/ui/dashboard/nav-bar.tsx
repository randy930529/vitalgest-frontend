"use client";

import { BellIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import UserMenuDropdown from "./profile/user-menu-dropdown";
import MenuOptionsDropdown from "./profile/menu-options-dropdown";
import { SessionType } from "@/app/lib/definitions";
import { useState } from "react";

export default function NavBar({ session }: { session: SessionType }) {
  const { id, email, name, lastname } = session?.user || {};
  const [toggleDropdown, setToggleDropdown] = useState({
    options: true,
    user: true,
  });

  const { options, user } = toggleDropdown;

  function handleToggle(e: any, value: boolean) {
    if (e.name === "options") {
      setToggleDropdown({ ...toggleDropdown, options: value, user: true });
    }
    if (e.name === "user") {
      setToggleDropdown({ ...toggleDropdown, user: value, options: true });
    }
  }

  return (
    <nav className="flex relative items-center lg:order-2">
      <MenuOptionsDropdown
        hiddenDropdown={options}
        setHiddenDropdown={handleToggle}
      />
      {/* <!-- Notifications --> */}
      <button
        type="button"
        data-dropdown-toggle="notification-dropdown"
        className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
      >
        <span className="sr-only">View notifications</span>
        {/* <!-- Bell icon --> */}
        <BellIcon className="w-8 h-8" />
      </button>
      {/* <!-- Question --> */}
      <button
        type="button"
        data-dropdown-toggle="notification-dropdown"
        className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
      >
        <span className="sr-only">View question</span>
        {/* <!-- Bell icon --> */}
        <QuestionMarkCircleIcon className="w-8 h-8" />
      </button>
      <UserMenuDropdown
        key={`user-${id}`}
        id={id}
        email={email}
        name={name}
        lastname={lastname}
        hiddenDropdown={user}
        setHiddenDropdown={handleToggle}
      />
    </nav>
  );
}
