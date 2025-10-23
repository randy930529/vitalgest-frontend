import { CustomMxState } from "./definitions";

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

/**
 * Obtiene los municipios a partir del Id de un estado
 * o una lista vacia si no existe un estado con ese Id.
 * @param stateId Id del estado de un pais.
 * @param STATES_WITH_MUNICIPALITIES Lista de estados del pais con sus respectivos municipios de cada estado.
 * @returns Retorna una lista de los municipios que pertenecen al estado.
 */
export function getMunicipalitiesOfState(
  stateId: string | number,
  STATES_WITH_MUNICIPALITIES: CustomMxState[]
): CustomMxState[] {
  return (
    STATES_WITH_MUNICIPALITIES.find(({ id }) => id === stateId)
      ?.municipalities || []
  );
}
