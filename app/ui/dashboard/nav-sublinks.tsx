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
  const controlsId = `${name.toLowerCase().replace(/\s+/g, "-")}-submenu`;

  return (
    <div
      className={clsx("relative flex shrink-0 flex-col md:w-full", {
        "z-[70]": !dropdown,
      })}
    >
      <button
        type="button"
        aria-label={name}
        title={name}
        aria-haspopup="menu"
        aria-expanded={!dropdown}
        aria-controls={controlsId}
        className="group relative z-[71] flex h-[52px] w-[52px] flex-none items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 md:h-[48px] md:w-full md:justify-start md:px-3"
        onClick={() => setDropdown(!dropdown)}
      >
        {icon && icon}
        <span className="hidden whitespace-nowrap text-center md:block">
          {name}
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className={clsx("hidden h-5 w-5 transition md:inline", {
            "rotate-180": !dropdown,
          })}
        />
      </button>
      <ul
        id={controlsId}
        role="menu"
        aria-label={`Submenu ${name}`}
        className={clsx(
          "absolute right-0 top-full z-[72] mt-2 w-48 space-y-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.5)] backdrop-blur-sm md:static md:mt-0 md:w-full md:space-y-2 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0",
          {
            hidden: dropdown,
          },
        )}
      >
        {children}
      </ul>
    </div>
  );
}
