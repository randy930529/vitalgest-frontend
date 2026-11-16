"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import clsx from "clsx";
import { NAV_ICONS, type NavIconName } from "@/app/ui/components/navigation";

export interface NavLinkData {
  name: string;
  href: string;
  icon?: NavIconName;
}

export function NavLink({ link }: { link: NavLinkData }) {
  const Icon = link.icon ? NAV_ICONS[link.icon] : undefined;
  const labelClass = Icon ? "sr-only md:not-sr-only md:block" : "block";
  const linkClass = !Icon
    ? "group flex h-[48px] w-full items-center justify-start gap-2 rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-800 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 md:justify-start md:px-3"
    : "group flex h-[52px] w-[52px] flex-none items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 md:h-[48px] md:w-full md:justify-start md:px-3";

  const segment = useSelectedLayoutSegments();
  const isActive =
    link.href === `/${segment.join("/")}` ||
    (link.href === "/dashboard" && segment.length === 0);

  const setActiveClassName = (classNames: string | undefined) =>
    clsx(classNames, {
      "!text-rose-600": isActive,
    });

  return (
    <Link
      href={link.href}
      className={setActiveClassName(linkClass)}
      aria-label={link.name}
      title={link.name}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={setActiveClassName(
            "h-5 w-5 text-slate-700 transition group-hover:text-rose-600",
          )}
        />
      )}
      <p className={labelClass}>{link.name}</p>
    </Link>
  );
}
