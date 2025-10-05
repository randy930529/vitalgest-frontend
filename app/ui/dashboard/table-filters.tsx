import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Filters({ children }: { children?: React.ReactNode }) {
  // <div>(Component) Barra de búsqueda y filtros - [CSR]</div>

  return (
    <div className="flex flex-col bg-blue-800 md:flex-row items-center justify-between md:space-y-0 p-4">
      <div className="w-full mb-4 md:mb-0 md:w-1/2">
        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Buscar
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Buscar"
              required
            />
          </div>
        </form>
      </div>
      {children}
    </div>
  );
}
