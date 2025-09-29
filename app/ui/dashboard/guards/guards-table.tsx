import { fetchGuards } from "@/app/lib/data";
import TableActions from "../tabla-actions";
import TablePagination from "../pagination";
import Filters from "../table-filters";
import TableActionDelete from "../button-delete";
import { deleteGuard } from "@/app/lib/actions";
import TableActionEdit from "../botton-edit";

const customHeaders = [
  { id: 0, label: "Jefe de Guardia" },
  { id: 1, label: "Fecha" },
  { id: 2, label: "Ambulancias" },
  { id: 3, label: "Estado" },
];

const customGuardsStates = [
  { id: 1, value: "new", label: "Nueva", bgColor: "bg-green-500" },
  { id: 2, value: "ongoing", label: "En curso", bgColor: "bg-orange-500" },
  { id: 3, value: "closed", label: "Cerrada", bgColor: "bg-red-500" },
];

export default async function GuardsTable() {
  // <div>(Component) Lista de guardias existentes - [CSR]</div>;
  const guards = await fetchGuards();

  return (
    <div className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <Filters />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              {customHeaders.map((header) => (
                <th key={header.id} scope="col" className="px-4 py-3">
                  {header.label}
                </th>
              ))}
              <th
                scope="col"
                className="px-4 py-3 flex items-center justify-end"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {guards?.map((guard) => (
              <tr key={guard.id} className="border-b dark:border-gray-700">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${guard.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-${guard.id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {guard.guardChief}
                </th>
                <td className="px-4 py-3">{guard.date}</td>
                <td className="px-4 py-3">{guard.ambulance}</td>
                <td className="px-4 py-3">
                  <GuardStatus state={guard.state} />
                </td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/guards/${guard.id}/edit`}
                  />
                  <TableActionDelete id={guard.id} actionDelete={deleteGuard} />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={guards.length} />
    </div>
  );
}

function GuardStatus({ state }: { state: string }) {
  const guardState = customGuardsStates.find(
    (customState) => state === customState.value
  );

  return (
    <div className="flex items-center">
      <div
        className={`h-2.5 w-2.5 rounded-full ${guardState?.bgColor} me-2`}
      ></div>
      {guardState?.label}
    </div>
  );
}
