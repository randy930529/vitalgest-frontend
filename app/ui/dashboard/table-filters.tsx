import Search from "@/app/ui/dashboard/search";

export default function Filters({ children }: { children?: React.ReactNode }) {
  // (Component) Barra de búsqueda y filtros - [CSR]

  return (
    <div className="flex flex-col items-stretch justify-between gap-3 border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] p-4 md:flex-row md:items-center md:gap-4">
      <section className="w-full md:mb-0 md:w-1/2">
        <div className="flex items-center">
          <label htmlFor="simple-search" className="sr-only">
            Buscar
          </label>
          <Search />
        </div>
      </section>
      <section className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
        {children}
      </section>
    </div>
  );
}
