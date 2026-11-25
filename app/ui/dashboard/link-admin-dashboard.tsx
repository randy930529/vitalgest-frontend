"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function LinkAdminDashboard({
  showCog,
  buttonClassName,
}: {
  showCog?: boolean;
  buttonClassName?: string;
}) {
  const segment = useSelectedLayoutSegment();

  if (!showCog || segment === "dashboard") return null;

  return (
    <Link
      href="/dashboard"
      title="Panel Administrativo"
      data-tooltip-id="admin-tooltip"
      className={buttonClassName}
    >
      <span className="sr-only">Link administration</span>
      {/* <!-- Cog icon --> */}
      <Cog6ToothIcon className="w-8 h-8" />
    </Link>
  );
}
