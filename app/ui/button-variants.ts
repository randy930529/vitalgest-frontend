// app/ui/button-variants.ts
/**
 * Definición centralizada de variantes de botones
 * Reemplaza strings de className duplicados en 20+ archivos
 *
 * Beneficios:
 * - Cambio de estilos en 1 lugar en lugar de 20
 * - Consistencia visual garantizada
 * - Bundle size reducido
 * - Fácil mantenimiento del diseño
 */

import { clsx } from "clsx";

export const buttonVariants = {
  /**
   * Botón principal (verde/azul)
   * Usado para acciones principales como "Guardar", "Crear", "Aceptar"
   */
  primary:
    "text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",

  /**
   * Botón secundario (gris)
   * Usado para acciones secundarias como "Cancelar", "Volver"
   */
  secondary:
    "text-white inline-flex items-center bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",

  /**
   * Botón de peligro (rojo)
   * Usado para acciones destructivas como "Eliminar", "Logout"
   */
  danger:
    "text-white inline-flex items-center bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",

  /**
   * Botón informativo (azul)
   * Usado para acciones de navegación y búsqueda
   */
  info: "text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800",

  /**
   * Botón de éxito (verde)
   * Usado para acciones confirmadas
   */
  success:
    "text-white inline-flex items-center bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",

  /**
   * Botón small para espacios compactos (pagination, etc)
   */
  infoSmall:
    "text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-2 md:px-5 md:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800",

  /**
   * Botón login (especial)
   */
  login:
    "text-white inline-flex items-center bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700 w-full mt-6",
} as const;

/**
 * Tipos para las variantes
 */
export type ButtonVariant = keyof typeof buttonVariants;

/**
 * Función helper para obtener clase de botón con posibilidad de extender
 * @param variant - Variante del botón
 * @param additional - Clases adicionales (override)
 * @returns String de className combinado
 */
export function getButtonClass(
  variant: ButtonVariant = "primary",
  additional?: string,
): string {
  return clsx(buttonVariants[variant], additional);
}

/**
 * Mapear propósito del botón a variante automáticamente
 * Útil para formularios genéricos
 */
export function getVariantByPurpose(
  purpose: "submit" | "cancel" | "delete" | "confirm" | "search",
): ButtonVariant {
  const purposeMap: Record<string, ButtonVariant> = {
    submit: "primary",
    cancel: "secondary",
    delete: "danger",
    confirm: "success",
    search: "info",
  };
  return purposeMap[purpose] || "primary";
}
