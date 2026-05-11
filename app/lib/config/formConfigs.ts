/**
 * Configuración centralizada de todos los formularios de la aplicación
 */

import type { FormFieldType, FormInputType } from "@/app/lib/definitions";
import { customUnits } from "./selectOptions";

export const formConfigs = {
  // Usuarios
  user: {
    name: {
      type: "text",
      title: "Nombre",
      required: true,
      placeholder: "Juan",
    },
    lastname: {
      type: "text",
      title: "Apellidos",
      required: true,
      placeholder: "Pérez García",
    },
    email: {
      type: "email",
      title: "Correo Electrónico",
      required: true,
      placeholder: "juan@example.com",
    },
    password: {
      type: "password",
      title: "Contraseña",
      required: true,
      placeholder: "••••••••",
    },
    position: {
      type: "text",
      title: "Cargo Laboral",
      required: true,
      placeholder: "Paramédico",
    },
  } as const,

  // Delegaciones
  delegation: {} as const,

  // Ambulancias
  ambulance: {
    number: {
      type: "text",
      title: "Número",
      required: true,
      placeholder: "AMB-001",
    },
    brand: {
      type: "text",
      title: "Marca",
      required: true,
      placeholder: "Ford",
    },
    model: {
      type: "text",
      title: "Modelo",
      required: true,
      placeholder: "Transit 2023",
    },
  } as const,

  // Suministros en Ambulancias
  supplyAmbulance: {} as const,

  // Suministros en Farmacias
  supplyPharmacy: {
    category: {
      type: "text",
      title: "Categoría",
      required: true,
    },
    specification: {
      type: "text",
      title: "Especificación",
      required: true,
    },
    measurementUnit: {
      type: "select",
      title: "Unidad de Medida",
      options: customUnits,
      required: true,
    },
    expirationDate: {
      type: "date",
      title: "Fecha de Vencimiento",
      required: true,
    },
    avaibleQuantity: {
      type: "number",
      title: "Cantidad",
      required: true,
    },
  } as const,
  changePassword: {
    password: {
      type: "password",
      title: "Contraseña actual",
      required: true,
      placeholder: "Entre su contraseña actual",
    },
    newPassword: {
      type: "password",
      title: "Nueva contraseña",
      required: true,
      placeholder: "Entre la nueva contraseña",
    },
  } as const,
} as const;

/**
 * Tipo helper para obtener la configuración de un formulario
 * Proporciona autocompletado en TypeScript
 */
export type FormConfigKey = keyof typeof formConfigs;
export type FormConfig = FormInputType;

/**
 * Función helper para obtener configuración y crear un nuevo objeto
 * - Devuelve una copia del objeto para evitar mutaciones accidentales
 */
export function getFormConfig(key: FormConfigKey): FormConfig {
  return { ...formConfigs[key] };
}

/**
 * Función helper para obtener campos de configuración en formato de formulario
 * Permite agregar campos dinámicos específicos para cada formulario
 * - Combina campos estáticos de la configuración con campos dinámicos proporcionados
 * - Devuelve un array de campos listo para usar en componentes de formulario
 */
export function getFormConfigFields(
  key: FormConfigKey,
  dynamicField?: FormFieldType[],
): FormFieldType[] {
  const config = getFormConfig(key);
  const fields = Object.keys(config).map((fieldName) => ({
    name: fieldName,
    ...config[fieldName],
  }));

  return [...fields, ...(dynamicField || [])] as FormFieldType[];
}

/**
 * Obtener solo campos específicos de una configuración
 */
export function getFormFields(
  key: FormConfigKey,
  fields: string[],
): FormConfig {
  const config = formConfigs[key];
  return Object.fromEntries(
    Object.entries(config).filter(([fieldName]) => fields.includes(fieldName)),
  ) as FormConfig;
}
