import { fetchDelegations } from "@/app/lib/data";
import TableActions from "../tabla-actions";
import TablePagination from "../pagination";
import Filters from "../table-filters";
import TableActionDelete from "../button-delete";
import { deleteDelegation } from "@/app/lib/actions";
import TableActionEdit from "../botton-edit";

const customHeaders = [
  { id: 0, label: "Estado" },
  { id: 1, label: "Municipio" },
  { id: 2, label: "Registrado por" },
  { id: 3, label: "Fecha de Registro" },
];

export default async function DelegationTable() {
  // <div>(Component) Lista de delegaciones existentes - [CSR]</div>;
  const delegations = await fetchDelegations();

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
            {delegations?.map((delegation) => (
              <tr key={delegation.id} className="border-b dark:border-gray-700">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-${delegation.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-${delegation.id}`}
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
                  {delegation.name?.split(", ")[1]}
                </th>
                <td className="px-4 py-3">{delegation.name?.split(", ")[0]}</td>
                <td className="px-4 py-3">{/*delegation.userToRegister*/}</td>
                <td className="px-4 py-3">{/*delegation.createdAt*/}</td>
                <TableActions>
                  <TableActionEdit
                    editLink={`/dashboard/delegations/${delegation.id}/edit`}
                  />
                  <TableActionDelete
                    id={delegation.id}
                    actionDelete={deleteDelegation}
                  />
                </TableActions>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination totalItems={delegations.length} />
    </div>
  );
}
