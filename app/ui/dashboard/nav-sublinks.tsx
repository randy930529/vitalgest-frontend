"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function NavSubLinks({
  name,
  icon,
  children,
}: {
  name: string;
  icon: React.ReactElement;
  children?: React.ReactNode;
}) {
  const [dropdown, setDropdown] = useState(true);

  return (
    <>
      <button
        type="button"
        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        onClick={() => setDropdown(!dropdown)}
      >
        {icon && icon}
        <span className="flex-1 text-center whitespace-nowrap">{name}</span>
        <ChevronDownIcon className="w-6 h-6" />
      </button>
      <ul
        className={clsx("py-2 space-y-2", {
          hidden: dropdown,
        })}
      >
        {children}
      </ul>
    </>
  );
}
