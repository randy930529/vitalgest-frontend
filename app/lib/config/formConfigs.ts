// app/lib/config/formConfigs.ts
/**
 * Configuración centralizada de todos los formularios de la aplicación
 * Single source of truth para estructuras de formularios
 */

import type { FormInputType } from "@/app/lib/definitions";

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
  supplyAmbulance: {
    area: {
      type: "select",
      title: "Área",
      required: true,
    },
    name: {
      type: "text",
      title: "Nombre del Suministro",
      required: true,
      placeholder: "Suministro...",
    },
    quantity: {
      type: "number",
      title: "Cantidad",
      required: true,
      placeholder: "0",
    },
    unit: {
      type: "select",
      title: "Unidad de Medida",
      required: true,
    },
  } as const,

  // Suministros en Farmacias
  supplyPharmacy: {
    name: {
      type: "text",
      title: "Nombre",
      required: true,
      placeholder: "Medicamento...",
    },
    quantity: {
      type: "number",
      title: "Cantidad",
      required: true,
      placeholder: "0",
    },
    unit: {
      type: "select",
      title: "Unidad de Medida",
      required: true,
    },
    expiryDate: {
      type: "date",
      title: "Fecha de Vencimiento",
      required: false,
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
 * Evita mutaciones directas
 */
export function getFormConfig(key: FormConfigKey): FormConfig {
  return { ...formConfigs[key] };
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
