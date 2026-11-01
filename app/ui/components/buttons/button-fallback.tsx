"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type ButtonFallbackProps = {
  title?: string;
  navigateTo: string;
};

export function ButtonFallback({
  title,
  navigateTo: href,
}: ButtonFallbackProps) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
    >
      <ChevronLeftIcon className="w-5 h-5" />
      {title || "Volver"}
    </Link>
  );
}
