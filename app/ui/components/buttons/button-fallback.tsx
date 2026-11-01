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
      className="px-3 py-2 rounded-lg bg-white border border-gray-300 flex items-center gap-2 text-gray-700 font-semibold shadow-sm transition-all"
    >
      <ChevronLeftIcon className="w-5 h-5" />
      {title || "Volver"}
    </Link>
  );
}
