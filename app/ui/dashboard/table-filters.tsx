import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Filters({ children }: { children?: React.ReactNode }) {
  // <div>(Component) Barra de búsqueda y filtros - [CSR]</div>

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] p-4 md:flex-row md:space-y-0 md:gap-2">
      <div className="w-full mb-4 md:mb-0 md:w-1/2">
        <form className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Buscar
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="simple-search"
              className="block w-full rounded-xl border border-slate-300 bg-white p-2 pl-10 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
              placeholder="Buscar"
              required
            />
          </div>
        </form>
      </div>
      <div className="flex items-center justify-around gap-3">{children}</div>
    </div>
  );
}
