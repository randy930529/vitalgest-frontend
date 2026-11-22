import Link from "next/link";
import clsx from "clsx";
import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Filters from "@/app/ui/dashboard/table-filters";
import ModalTrigger from "@/app/ui/button-modal";
import TablePagination from "@/app/ui/components/pagination";

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "rounded bg-slate-200 animate-pulse overflow-hidden",
        className,
      )}
    />
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-slate-200/80 animate-pulse overflow-hidden",
        className,
      )}
    />
  );
}

export function TableSkeletonBase({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      {children}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-500">
          <thead className="bg-slate-100/80 text-xs uppercase text-slate-600">
            <tr>
              <th scope="col" className="px-6 py-3">
                <SkeletonLine className="h-4" />
              </th>
              <th scope="col" className="px-6 py-3">
                <SkeletonLine className="h-4" />
              </th>
              <th scope="col" className="px-6 py-3">
                <SkeletonLine className="h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4">
                <SkeletonLine className="h-4" />
              </td>
              <td className="px-6 py-4">
                <SkeletonLine className="h-4" />
              </td>
              <td className="px-6 py-4">
                <SkeletonLine className="h-4" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={0} />
    </div>
  );
}

export function TableSkeleton({
  title,
  modelContent,
}: {
  title: string;
  modelContent: React.ReactElement<{ onClose: () => void }>;
}) {
  return (
    <TableSkeletonBase>
      <Filters>
        <ModalTrigger title={title} modelContent={modelContent} />
      </Filters>
    </TableSkeletonBase>
  );
}

export function FormSkeleton({ goBackUrl }: { goBackUrl: string }) {
  return (
    <section className="relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        <span className="w-1/3 h-6 bg-gray-300 rounded" />
      </h2>
      <p className="ms-6 my-2 font-semibold w-1/3 h-4 bg-gray-300 text-gray-500 dark:text-gray-400 text-center md:text-left rounded"></p>
      <div className="flex flex-col items-center justify-center md:space-y-0 p-4">
        <div>
          <ModalFormSkeleton fields={4} columns={2} />
          <div className="flex flex-wrap items-center justify-end w-full gap-3 border-t border-slate-200 pt-6">
            <div></div>
            <Link
              href={goBackUrl}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Regresar
            </Link>
            <div></div>
          </div>
        </div>
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
    <section className="mt-7 dark:bg-gray-800 relative overflow-hidden">
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <div className="w-full">
          <div className={`grid gap-4 mb-4 ${columnClasses[columns]}`}>
            {Array.from({ length: fields }).map((_, index) => (
              <div key={index}>
                <SkeletonLine className="h-4 mt-4 mb-2 w-1/2" />
                <SkeletonBlock className="block h-10 w-full p-2.5 !rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChecklistCreateSkeleton() {
  return (
    <section className="relative mt-5 overflow-hidden rounded-[18px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm sm:p-6">
      <div className="grid gap-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 text-center">
              <SkeletonLine className="mx-auto h-4 w-24" />
              <SkeletonLine className="mx-auto h-6 w-36" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,450px)_1fr]">
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <SkeletonLine className="h-5 w-36" />
                <SkeletonBlock className="h-12 w-full border border-slate-300" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center lg:justify-center">
            <SkeletonBlock className="h-14 w-full max-w-[250px] bg-rose-300/90" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChecklistQuestionsSkeleton() {
  return (
    <section className="relative md:space-y-0 p-4 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4 shadow-md sm:rounded-lg">
        <div className="p-4 md:col-span-1 md:row-span-1">
          <ol className="flex flex-col justify-evenly gap-2 relative">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex flex-row gap-2 items-center">
                <SkeletonLine className="h-6 w-6 rounded-full" />
                <SkeletonLine className="h-6 flex-1" />
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-2 p-4 md:col-span-3 md:row-span-1">
          <SkeletonLine className="h-7 w-[360px] max-w-full" />
          <div className="space-y-4 px-3 py-3 md:px-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[52px,minmax(0,1fr),104px] items-center gap-3 md:gap-4"
              >
                <div className="flex justify-center">
                  <SkeletonLine className="h-5 w-10 rounded-full md:w-12" />
                </div>
                <SkeletonLine className="h-4 w-16 md:w-[min(340px,80%)]" />
                <SkeletonLine className="justify-self-end h-5 w-14 md:w-[104px]" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 mt-10 sm:col-span-4 md:pr-10">
          <SkeletonBlock className="h-11 w-28" />
          <SkeletonBlock className="h-11 w-28" />
        </div>
      </div>
    </section>
  );
}

export function ChecklistNotesSkeleton() {
  return (
    <section className={`relative overflow-hidden md:space-y-0 p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4 shadow-md sm:rounded-lg overflow-hidden">
        <div className="p-4 md:col-span-1 md:row-span-1">
          <ol className="flex flex-col justify-evenly gap-2 relative">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex flex-row gap-2 items-center">
                <SkeletonLine className="h-6 w-6 rounded-full" />
                <SkeletonLine className="h-6 flex-1" />
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-2 p-4 md:col-span-3 md:row-span-1">
          <SkeletonLine className="h-7 w-[360px] max-w-full" />
          <SkeletonBlock className="h-32" />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 pt-2">
            <SkeletonBlock className="h-11 w-28" />
            <SkeletonBlock className="h-11 w-28" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProfileEditSkeleton() {
  return (
    <section className="mt-7 space-y-6">
      <SkeletonBlock className="h-64" />
      <div className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
        <SkeletonBlock className="h-[520px]" />
        <SkeletonBlock className="h-[520px]" />
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
          className="relative h-28 overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)]"
        >
          <div className="flex h-full items-center justify-between p-5">
            <SkeletonBlock className="h-12 w-12" />
            <div className="space-y-3">
              <SkeletonLine className="h-3 w-24" />
              <SkeletonLine className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function DashboardChartsSkeleton() {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] xl:col-span-2">
        <div className="p-4">
          <SkeletonLine className="h-5 w-72" />
          <SkeletonLine className="mt-2 h-3 w-80" />
          <div className="mt-4 flex gap-2">
            <SkeletonBlock className="h-7 w-14" />
            <SkeletonBlock className="h-7 w-16" />
            <SkeletonBlock className="h-7 w-16" />
          </div>
          <SkeletonBlock className="mt-5 h-60" />
        </div>
      </div>
      <div className="relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)]">
        <div className="p-4 h-full">
          <SkeletonLine className="h-5 w-44" />
          <SkeletonLine className="mt-2 h-3 w-64" />
          <div className="flex justify-center items-center w-full h-full">
            <SkeletonBlock className="h-40 w-40 rounded-full" />
          </div>
        </div>
      </div>
      <div className="relative min-h-[340px] overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] xl:col-span-3">
        <div className="p-4">
          <SkeletonLine className="h-5 w-72" />
          <SkeletonLine className="mt-2 h-3 w-80" />
          <div className="mt-4 flex gap-2">
            <SkeletonBlock className="h-7 w-14" />
            <SkeletonBlock className="h-7 w-16" />
            <SkeletonBlock className="h-7 w-16" />
          </div>
          <SkeletonBlock className="mt-5 h-60" />
        </div>
      </div>
    </section>
  );
}

export function DashboardOperationalSkeleton() {
  // TODO: Actualizar el diseño cuando realice las notificaciones y el panel de operaciones
  return (
    <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
      <div
        className={`relative h-[520px] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] animate-pulse`}
      >
        <div className="p-6">
          <SkeletonLine className="h-5 w-72" />
          <SkeletonLine className="mt-2 h-3 w-80" />
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
        className={`relative h-[520px] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] animate-pulse`}
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
        `flex items-center justify-center absolute inset-0 bg-slate-200`,
        skeletonClassName,
      )}
      aria-hidden="true"
    >
      <PhotoIcon className="h-12 w-12 text-slate-400 animate-pulse" />
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
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function HeaderStatsSkeleton() {
  return <SkeletonBlock className="relative h-20 w-60" />;
}

export function GuardFormSkeleton({ goBackUrl }: { goBackUrl?: string }) {
  return (
    <section className="relative mt-7 overflow-hidden rounded-lg border border-white/80 bg-white/90 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      {goBackUrl && (
        <>
          <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
            <PencilSquareIcon className="w-6 h-6" />
            <SkeletonLine className="relative w-4/5 h-6" />
          </h2>
          <SkeletonLine className="relative w-1/2 h-4 ms-6 my-2" />
        </>
      )}
      <div className="flex flex-col items-center justify-center space-y-6 p-8 sm:p-10">
        <SkeletonBlock className="relative h-[140px] w-full shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)]" />
        <div className="w-full p-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 sm:p-5">
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Datos Generales
          </h4>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={"guard-input-sk" + index}>
              <SkeletonLine className="relative w-1/3 h-4 ms-6 my-2" />
              <SkeletonLine className="relative w-4/5 h-9 ms-6 my-2" />
            </div>
          ))}
          <div className="flex w-full justify-center">
            <SkeletonBlock className="relative h-12 w-44" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <SkeletonBlock className="inline-flex border border-slate-200 bg-white transition hover:border-slate-300 hover:bg-slate-50 h-11 w-24 rounded-xl px-4 text-sm opacity-50 cursor-not-allowed" />
            {goBackUrl ? (
              <Link
                href={goBackUrl}
                className="inline-flex items-center justify-center border border-slate-200 bg-white font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 h-11 rounded-xl px-4 text-sm"
              >
                Regresar
              </Link>
            ) : (
              <div className="inline-flex items-center justify-center border border-slate-200 bg-white font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 h-11 rounded-xl px-4 text-sm">
                Cancelar
              </div>
            )}
            <SkeletonBlock className="inline-flex border border-rose-200 !bg-rose-500 transition hover:border-rose-300 h-11 w-24 rounded-xl px-4 text-sm opacity-50 cursor-not-allowed" />
          </div>
        </div>
      </div>
    </section>
  );
}
