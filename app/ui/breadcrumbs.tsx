import { clsx } from "clsx";
import Link from "next/link";
import { ChevronDoubleRightIcon, HomeIcon } from "@heroicons/react/24/outline";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="my-3 block rounded-2xl border border-white/80 bg-white/80 px-4 py-2 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur-sm"
    >
      <ol className="flex items-center text-xs md:text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              "flex items-center",
              breadcrumb.active ? "text-rose-600" : "text-slate-500",
            )}
          >
            <Link href={breadcrumb.href} className="font-semibold">
              {breadcrumb.label ? (
                breadcrumb.label
              ) : (
                <HomeIcon className="w-4 h-4" />
              )}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-2 text-slate-400">
                <ChevronDoubleRightIcon className="w-4 h-4" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
