"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import type { StateType } from "@/app/lib/definitions";

/**
 * Hook personalizado para manejar notificaciones de formularios
 *
 * @param state - Estado del formulario (errors y message)
 * @param onClose - Callback opcional para cerrar modal/diálogo
 * @param onSuccess - Callback opcional para ejecutar después del éxito
 *
 * @example
 * const [state, formAction] = useActionState(createUser, initialState);
 * useFormNotifications({ state, onClose });
 */
export function useFormNotifications<T extends Record<string, string[]>>({
  state,
  onClose,
  onSuccess,
}: {
  state: StateType<T>;
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  // Efecto para mensaje de éxito
  useEffect(() => {
    if (!state.message) return;

    toast.success(state.message);

    // Ejecutar callback de éxito si existe
    onSuccess?.();

    // Cerrar modal si existe callback
    onClose?.();
  }, [state.message, onClose, onSuccess]);

  // Efecto para errores
  useEffect(() => {
    if (!state.errors) return;

    // Mostrar cada error como un toast separado
    Object.values(state.errors).forEach((errorArray) => {
      errorArray.forEach((error: string) => {
        toast.error(error);
      });
    });
  }, [state.errors]);
}
