"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { createPageURL, generatePagination } from "@/app/lib/utils";
import { Button } from "@/app/ui/button";

const ITEMS_PER_PAGE = Number(process.env.ITEMS_PER_PAGE ?? "10");

export default function TablePagination({
  totalItems,
}: {
  totalItems: number;
}) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    params.set("display", ITEMS_PER_PAGE.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);
  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <nav
      className="flex flex-col items-start justify-between space-y-3 border-t border-slate-200/80 p-4 md:flex-row md:items-center md:space-y-0"
      aria-label="Table navigation"
    >
      <span className="text-sm font-medium text-slate-500">
        Mostrando
        <span className="ml-1 mr-1 font-semibold text-slate-900">
          {`${startItem} - ${endItem}`}
        </span>
        de
        <span className="ml-1 font-semibold text-slate-900">{totalItems}</span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </li>
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined;

          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (page === "...") position = "middle";

          return (
            <li key={`item-${page}-${index}`}>
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            </li>
          );
        })}
        <li>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
        </li>
      </ul>
    </nav>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx(
    "flex items-center justify-center border border-slate-300 bg-white px-3 py-2 text-sm leading-tight text-slate-600 transition hover:bg-slate-100 hover:text-slate-800",
    {
      "z-10 border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800":
        isActive,
    },
  );

  return isActive || position === "middle" ? (
    <div aria-current={isActive ? "page" : undefined} className={className}>
      {page}
    </div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = clsx(
    "flex h-full items-center justify-center border border-slate-300 bg-white px-3 py-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700",
    {
      "pointer-events-none text-slate-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
      "ml-0 rounded-l-lg": direction === "left",
      "leading-tight rounded-r-lg": direction === "right",
    },
  );

  const icon =
    direction === "left" ? (
      <>
        <span className="sr-only">Página anterior</span>
        <ChevronLeftIcon className="w-5 h-5" />
      </>
    ) : (
      <>
        <span className="sr-only">Página siguiente</span>
        <ChevronRightIcon className="w-5 h-5" />
      </>
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

function PaginationButton({
  href,
  direction,
  isDisabled,
  title,
  hasIcon = true,
  isLoading = false,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
  title?: string;
  hasIcon?: boolean;
  isLoading?: boolean;
}) {
  const className = clsx(
    "text-white inline-flex items-center bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-2 sm:px-5 sm:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800",
    {
      "pointer-events-none text-gray-300 bg-primary-300": isDisabled,
    },
  );

  const icon =
    direction === "left" ? (
      <>
        <span className="sr-only">Previous</span>
        {hasIcon && <ChevronLeftIcon className="w-5 h-5" />}
        {title ? title : "Anterior"}
      </>
    ) : (
      <>
        <span className="sr-only">Next</span>
        {title ? title : "Siguiente"}
        {hasIcon && <ChevronRightIcon className="w-5 h-5" />}
      </>
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : direction === "left" ? (
    <Link className={className} href={href}>
      {icon}
    </Link>
  ) : (
    <Button type="submit" className={className} isLoading={isLoading}>
      {icon}
    </Button>
  );
}

export function PaginationChecklist({
  isLast,
  link = "ambulances",
  submitDisabled,
}: {
  isLast: boolean;
  link?: string;
  submitDisabled?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("step")) || 1;
  const isNotes = !!searchParams.get("notes");
  const { guardId, id } = useParams<{ guardId: string; id: string }>();

  return (
    <div className="flex w-full justify-between gap-4">
      <PaginationButton
        href={
          currentPage - 1
            ? createPageURL(currentPage - 1, searchParams, pathname)
            : `/checklists/${guardId}/${link}/${id}/create`
        }
        direction="left"
      />
      {isLast && isNotes ? (
        <Button
          type="submit"
          disabled={submitDisabled}
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-2 md:px-5 md:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
        >
          Enviar
        </Button>
      ) : (
        <>
          <PaginationButton
            href="next"
            direction="right"
            isLoading={!!submitDisabled}
          />
        </>
      )}
    </div>
  );
}
