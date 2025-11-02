"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { createPageURL, generatePagination } from "@/app/lib/utils";
import { Button } from "@/app/ui/button";

const ITEMS_PER_PAGE = parseInt(process.env.ITEMS_PER_PAGE || "5");

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
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Mostrando
        <span className="font-semibold text-gray-900 ml-1 mr-1 dark:text-white">
          {`${currentPage} - ${totalPages}`}
        </span>
        de
        <span className="font-semibold text-gray-900 ml-1 dark:text-white">
          {totalItems}
        </span>
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
    "flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
    {
      "z-10 text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:bg-gray-700 dark:text-white":
        isActive,
    }
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
    "flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
      "ml-0 rounded-l-lg": direction === "left",
      "leading-tight rounded-r-lg": direction === "right",
    }
  );

  const icon =
    direction === "left" ? (
      <>
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="w-5 h-5" />
      </>
    ) : (
      <>
        <span className="sr-only">Next</span>
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
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
  title?: string;
  hasIcon?: boolean;
}) {
  const className = clsx(
    "text-white inline-flex items-center bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-2 sm:px-5 sm:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800",
    {
      "pointer-events-none text-gray-300 bg-primary-300": isDisabled,
    }
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
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

export function PaginationChecklist({ isLast }: { isLast: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("step")) || 1;
  const isNotes = !!searchParams.get("notes");
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex w-full justify-between gap-4">
      <PaginationButton
        href={
          currentPage - 1
            ? createPageURL(currentPage - 1, searchParams, pathname)
            : `/checklists/ambulances/${id}`
        }
        direction="left"
      />
      {isLast && isNotes ? (
        <>
          <PaginationButton
            href={createPageURL(currentPage + 1, searchParams, pathname)}
            direction="right"
            title="Guardar"
            isDisabled={isLast}
            hasIcon={false}
          />
          <Button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-2 md:px-5 md:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
          >
            Enviar
          </Button>
        </>
      ) : (
        <>
          <Button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-2 md:px-5 md:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
          >
            Guardar
          </Button>
          <PaginationButton
            href={
              createPageURL(currentPage + 1, searchParams, pathname) +
              `${isLast && !isNotes ? "&notes=1" : ""}`
            }
            direction="right"
          />
        </>
      )}
    </div>
  );
}
