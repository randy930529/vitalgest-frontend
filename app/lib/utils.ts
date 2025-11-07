import { ReadonlyURLSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { CustomMxState, StepItemType } from "./definitions";

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

export const createPageURL = (
  pageNumber: number | string,
  searchParams: ReadonlyURLSearchParams,
  pathname: string
): string => {
  const params = new URLSearchParams(searchParams);
  params.delete("notes");
  params.set("step", pageNumber.toString());
  return `${pathname}?${params.toString()}`;
};

/**
 * Obtiene los municipios a partir del Id de un estado
 * o una lista vacia si no existe un estado con ese Id.
 * @param stateId Id del estado de un pais.
 * @param STATES_WITH_MUNICIPALITIES Lista de estados del pais con sus respectivos municipios de cada estado.
 * @returns Retorna una lista de los municipios que pertenecen al estado.
 */
export const getMunicipalitiesOfState = (
  stateId: string | number,
  STATES_WITH_MUNICIPALITIES: CustomMxState[]
): CustomMxState[] => {
  return (
    STATES_WITH_MUNICIPALITIES.find(({ value }) => value === stateId)
      ?.municipalities || []
  );
};

export const getStatusIcon = (status?: StepItemType["status"]) => {
  const customStepItem = {
    completed: { icon: CheckCircleIcon, color: "text-green-500" },
    pending: { icon: ClockIcon, color: "text-yellow-500" },
    error: { icon: XCircleIcon, color: "text-red-500" },
    default: { icon: ClockIcon, color: "text-gray-400" },
  };

  return customStepItem[status || "default"];
};

/**
 * Convierte una cadena de fecha en formato DD/MM/YYYY
 * @param dateString Cadena de fecha (Ej: "2024-01-15T00:00:00.000Z")
 * @returns Retorna la fecha formateada como string (Ej: "15/01/2024")
 */
export const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
