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
    <nav aria-label="Breadcrumb" className="my-3 block">
      <ol className="flex items-center text-xs md:text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              "flex items-center",
              breadcrumb.active ? "text-gray-900" : "text-gray-500"
            )}
          >
            <Link href={breadcrumb.href}>
              {breadcrumb.label ? (
                breadcrumb.label
              ) : (
                <HomeIcon className="w-4 h-4" />
              )}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-2">
                <ChevronDoubleRightIcon className="w-4 h-4" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
