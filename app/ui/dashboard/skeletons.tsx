import { ReactElement } from "react";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Filters from "@/app/ui/dashboard/table-filters";
import ModalTrigger from "@/app/ui/button-modal";
import TablePagination from "@/app/ui/dashboard/pagination";

// Loading animation
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
      className={`mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden ${shimmer}`}
    >
      <Filters>
        <ModalTrigger title={title} modelContent={modelContent} />
      </Filters>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
      className={`mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden ${shimmer}`}
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
