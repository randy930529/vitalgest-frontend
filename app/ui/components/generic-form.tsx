"use client";

import { useActionState } from "react";
import type { FormFieldType, StateType } from "@/app/lib/definitions";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import {
  FormInput,
  FormSelect,
  FormDatepicker,
} from "@/app/ui/dashboard/form-fields";
import { FormButtons } from "@/app/ui/button";

export interface GenericFormProps<
  T extends StateType<Record<string, string[]>>,
> {
  /** Array de campos a renderizar */
  fields: FormFieldType[];

  /** Acción del servidor para manejar el submit */
  onSubmit: (prevState: T, formData: FormData) => Promise<T>;

  /** Estado inicial */
  initialState: T;

  /** Callback cuando se completa exitosamente */
  onSuccess?: () => void;

  /** Callback para cerrar modal/diálogo */
  onCancel?: () => void;

  /** Mostrar botones de acción */
  showButtons?: boolean;

  /** Texto personalizado de botones */
  submitText?: string;
  cancelText?: string;

  /** Campos condicionales basados en estado */
  conditionalFields?: Record<string, (state: T) => boolean>;

  /** Callback personalizado para validación cliente */
  onValidate?: (data: Record<string, any>) => Record<string, string>;
}

/**
 * Componente de formulario genérico reutilizable
 */
export function GenericForm<T extends StateType<Record<string, string[]>>>({
  fields,
  onSubmit,
  initialState,
  onSuccess,
  onCancel,
  showButtons = true,
  submitText = "Guardar",
  cancelText = "Cancelar",
  conditionalFields = {},
  onValidate,
}: GenericFormProps<T>) {
  const [state, formAction, isLoading] = useActionState<T, FormData>(
    onSubmit,
    initialState as Awaited<T>,
  );

  // Usar hook de notificaciones
  useFormNotifications({
    state,
    onClose: onCancel,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const renderField = (field: FormFieldType, fieldError?: string[]) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <FormInput
            key={field.name}
            name={field.name}
            errors={fieldError}
            customFormInput={{
              [field.name]: {
                type: field.type,
                title: field.title || field.name,
                required: field.required,
                placeholder: field.placeholder,
              },
            }}
            initialValue={field.defaultValue}
          />
        );

      case "select":
        return (
          <FormSelect
            key={field.name}
            name={field.name}
            title={field.title}
            options={field.options}
            defaultValue={field.defaultValue}
            errors={fieldError}
            required={field.required}
          />
        );

      case "date":
        const dateStart = new Date().toISOString().split("T")[0];
        return (
          <FormDatepicker
            key={field.name}
            name={field.name}
            title={field.title}
            initialDate={field.defaultValue || dateStart}
            errors={fieldError}
            required={field.required}
          />
        );

      case "custom":
        return (
          <div className="contents" key={field.name}>
            {field.component}
          </div>
        );

      default:
        return null;
    }
  };

  const visibleFields = fields.filter((field) =>
    conditionalFields[field.name] ? conditionalFields[field.name](state) : true,
  );

  return (
    <form action={formAction}>
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        {visibleFields.map((field) =>
          renderField(field, (state.errors as any)?.[field.name as any]),
        )}
      </div>

      {showButtons && (
        <FormButtons
          onCancel={onCancel}
          submitText={submitText}
          cancelText={cancelText}
          isLoading={isLoading}
        />
      )}
    </form>
  );
}
