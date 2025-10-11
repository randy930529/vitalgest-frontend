"use client";

import { useState } from "react";
import { BellIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { UserType } from "@/app/lib/definitions";
import UserMenuDropdown from "@/app/ui/dashboard/profile/user-menu-dropdown";
import MenuOptionsDropdown from "@/app/ui/dashboard/profile/menu-options-dropdown";

export default function NavBar({ user }: { user: UserType }) {
  const { id, email, name, lastname } = user;
  const [toggleDropdown, setToggleDropdown] = useState({
    mOptions: true,
    mUser: true,
  });

  const { mOptions: options, mUser } = toggleDropdown;

  function handleToggle(e: any, value: boolean) {
    if (e.name === "options") {
      setToggleDropdown({ ...toggleDropdown, mOptions: value, mUser: true });
    }
    if (e.name === "user") {
      setToggleDropdown({ ...toggleDropdown, mUser: value, mOptions: true });
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
        hiddenDropdown={mUser}
        setHiddenDropdown={handleToggle}
      />
    </nav>
  );
}
