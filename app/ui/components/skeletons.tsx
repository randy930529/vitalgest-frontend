import { ReactElement } from "react";
import Link from "next/link";
import clsx from "clsx";
import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Filters from "@/app/ui/dashboard/table-filters";
import ModalTrigger from "@/app/ui/button-modal";
import TablePagination from "@/app/ui/components/pagination";

// Shared loading animation class
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function TableSkeleton({
  title,
  modelContent,
}: {
  title: string;
  modelContent: ReactElement<{ onClose: () => void }>;
}) {
  return (
    <div
      className={`relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm ${shimmer}`}
    >
      <Filters>
        <ModalTrigger title={title} modelContent={modelContent} />
      </Filters>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-500">
          <thead className="bg-slate-100/80 text-xs uppercase text-slate-600">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div className="h-4 bg-gray-300 rounded" />
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-4 bg-gray-300 rounded" />
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-4 bg-gray-300 rounded" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-300 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-300 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-300 rounded" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={0} />
    </div>
  );
}

export function FormSkeleton({ goBackUrl }: { goBackUrl: string }) {
  return (
    <section
      className={`relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm ${shimmer}`}
    >
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        <span className="w-1/3 h-6 bg-gray-300 rounded" />
      </h2>
      <p className="ms-6 my-2 font-semibold w-1/3 h-4 bg-gray-300 text-gray-500 dark:text-gray-400 text-center md:text-left rounded"></p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form action="">
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label className="block h-4 bg-gray-300 mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white rounded"></label>
              <input
                type="text"
                disabled
                className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block h-4 bg-gray-300 mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white rounded"></label>
              <input
                type="text"
                disabled
                className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <div>
                <label className="block h-4 bg-gray-300 mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white rounded"></label>
                <input
                  type="text"
                  disabled
                  className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block h-4 bg-gray-300 mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white rounded"></label>
                <input
                  type="text"
                  disabled
                  className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href={goBackUrl}
              className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Regresar
            </Link>
            <Link
              href={goBackUrl}
              className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Guardar
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export function ModalFormSkeleton({
  fields = 4,
  columns = 2,
}: {
  fields?: number;
  columns?: 1 | 2 | 3 | 4;
}) {
  const columnClasses: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  };

  return (
    <section
      className={`mt-7 dark:bg-gray-800 relative overflow-hidden ${shimmer}`}
    >
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <form className="w-full" action="">
          <div className={`grid gap-4 mb-4 ${columnClasses[columns]}`}>
            {Array.from({ length: fields }).map((_, index) => (
              <div key={index}>
                <label className="block h-4 bg-gray-300 mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white rounded w-1/2" />
                <input
                  type="text"
                  disabled
                  className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                />
              </div>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}

export function ChecklistCreateSkeleton() {
  return (
    <section
      className={`relative mt-5 overflow-hidden rounded-[18px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm sm:p-6 ${shimmer}`}
    >
      <div className="grid gap-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 text-center">
              <div className="mx-auto h-4 w-24 rounded bg-slate-200" />
              <div className="mx-auto h-6 w-36 rounded bg-slate-300" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,450px)_1fr]">
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-5 w-36 rounded bg-slate-200" />
                <div className="h-12 w-full rounded-xl border border-slate-200 bg-white/80" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center lg:justify-center">
            <div className="h-14 w-full max-w-[250px] rounded-2xl bg-rose-300/90" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChecklistQuestionsSkeleton() {
  return (
    <section className={`relative md:space-y-0 p-4 ${shimmer}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4 shadow-md sm:rounded-lg overflow-hidden">
        <div className="p-4 md:col-span-1 md:row-span-1">
          <ol className="flex flex-col justify-evenly gap-2 relative">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex flex-row gap-2 items-center">
                <div className="h-6 w-6 rounded-full border border-slate-300 bg-white" />
                <div className="h-6 flex-1 rounded-[10px] bg-slate-200/90" />
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-2 p-4 md:col-span-3 md:row-span-1">
          <div className="h-7 w-[360px] max-w-full rounded bg-slate-300" />
          <div className="space-y-4 px-3 py-3 md:px-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[52px,minmax(0,1fr),104px] items-center gap-3 md:gap-4"
              >
                <div className="flex justify-center">
                  <div className="h-5 w-10 rounded-full bg-slate-300 md:w-12" />
                </div>
                <div className="h-4 rounded w-16 bg-slate-200/90 md:w-[min(340px,80%)]" />
                <div className="justify-self-end h-5 w-14 rounded-xl border border-slate-200 bg-white/90 md:w-[104px]" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 pt-2">
            <div className="h-11 w-[110px] rounded-lg bg-slate-300" />
            <div className="h-11 w-[110px] rounded-lg bg-slate-200/90" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChecklistNotesSkeleton() {
  return (
    <section className={`relative overflow-hidden md:space-y-0 p-4 ${shimmer}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4 shadow-md sm:rounded-lg overflow-hidden">
        <div className="p-4 md:col-span-1 md:row-span-1">
          <ol className="flex flex-col justify-evenly gap-2 relative">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex flex-row gap-2 items-center">
                <div className="h-6 w-6 rounded-full border border-slate-300 bg-white" />
                <div className="h-6 flex-1 rounded-[10px] bg-slate-200/90" />
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-2 p-4 md:col-span-3 md:row-span-1">
          <div className="h-7 w-[360px] max-w-full rounded bg-slate-300" />
          <div className="h-32 rounded-2xl bg-slate-200/90" />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="h-20 rounded-2xl bg-slate-200" />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="h-20 rounded-2xl bg-slate-200" />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 pt-2">
            <div className="h-11 w-[110px] rounded-lg bg-slate-300" />
            <div className="h-11 w-[110px] rounded-lg bg-slate-200/90" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProfileEditSkeleton() {
  return (
    <section className="mt-7 animate-pulse space-y-6">
      <div className="h-64 rounded-[36px] bg-slate-200/70" />
      <div className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
        <div className="h-[520px] rounded-[32px] bg-slate-200/70" />
        <div className="h-[520px] rounded-[32px] bg-slate-200/70" />
      </div>
    </section>
  );
}

export function DashboardKpiCardsSkeleton() {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`relative h-28 overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] ${shimmer}`}
        >
          <div className="flex h-full items-center justify-between p-5">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-8 w-16 rounded bg-slate-300" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-slate-300" />
          </div>
        </div>
      ))}
    </section>
  );
}

export function DashboardChartsSkeleton() {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div
        className={`relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] xl:col-span-2 ${shimmer}`}
      >
        <div className="p-4">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-64 rounded bg-slate-200" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-14 rounded-full bg-slate-200" />
            <div className="h-7 w-16 rounded-full bg-slate-200" />
            <div className="h-7 w-16 rounded-full bg-slate-200" />
          </div>
          <div className="mt-5 h-[230px] rounded-2xl bg-slate-200/80" />
        </div>
      </div>
      <div
        className={`relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] ${shimmer}`}
      >
        <div className="p-4">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-52 rounded bg-slate-200" />
          <div className="mt-5 h-[230px] rounded-full bg-slate-200/80" />
        </div>
      </div>
      <div
        className={`relative min-h-[340px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] xl:col-span-3 ${shimmer}`}
      >
        <div className="p-4">
          <div className="h-4 w-48 rounded bg-slate-200" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-14 rounded-full bg-slate-200" />
            <div className="h-7 w-16 rounded-full bg-slate-200" />
            <div className="h-7 w-16 rounded-full bg-slate-200" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-2 py-1"
              >
                <div className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                <div className="h-2.5 flex-1 rounded bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="mt-5 h-[230px] rounded-2xl bg-slate-200/80" />
        </div>
      </div>
    </section>
  );
}

export function DashboardOperationalSkeleton() {
  return (
    <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
      <div
        className={`relative h-[520px] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] ${shimmer}`}
      >
        <div className="p-6">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 rounded bg-slate-200" />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-24 rounded-2xl bg-slate-200/80" />
            <div className="h-24 rounded-2xl bg-slate-200/80" />
            <div className="h-24 rounded-2xl bg-slate-200/80" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-20 rounded-2xl bg-slate-200/80" />
            <div className="h-20 rounded-2xl bg-slate-200/80" />
          </div>
          <div className="mt-6 h-28 rounded-2xl bg-slate-200/80" />
          <div className="mt-6 h-16 rounded-2xl bg-slate-200/80" />
        </div>
      </div>
      <div
        className={`relative h-[520px] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] ${shimmer}`}
      >
        <div className="p-6">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 rounded bg-slate-200" />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-24 rounded-2xl bg-slate-200/80" />
            <div className="h-24 rounded-2xl bg-slate-200/80" />
            <div className="h-24 rounded-2xl bg-slate-200/80" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-36 rounded-2xl bg-slate-200/80" />
            <div className="h-36 rounded-2xl bg-slate-200/80" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ImageLoadingSkeleton({
  skeletonClassName,
}: {
  skeletonClassName?: string;
}) {
  return (
    <div
      className={clsx(
        `flex items-center justify-center absolute inset-0`,
        shimmer,
        "bg-slate-200",
        skeletonClassName,
      )}
      aria-hidden="true"
    >
      <PhotoIcon className="h-12 w-12 text-slate-400" />
    </div>
  );
}

export function SkeletonPanel({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      aria-label={ariaLabel}
      className={clsx(
        "relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)]",
        className,
      )}
    >
      <div className="animate-pulse space-y-4">{children}</div>
    </section>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={clsx("rounded bg-slate-200", className)} />;
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={clsx("rounded-2xl bg-slate-200/80", className)} />;
}
