import { z } from "zod";
import { revalidatePath } from "next/cache";
import { verifySession, verifyAuthorization } from "@/app/lib/dal";
import type { ResponseAPIType, StateType } from "@/app/lib/definitions";
import { ERROR_MESSAGES } from "../../config/constants";

/**
 * Interfaz genérica para configuración de acciones.
 */
export interface ActionConfig {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  adminOnly?: boolean;
  revalidatePathAfter?: string[];
}

/**
 * Error tipado para acciones del servidor.
 */
export interface ActionError {
  type: "VALIDATION_ERROR" | "UNAUTHORIZED" | "API_ERROR" | "UNKNOWN_ERROR";
  message: string;
  errors?: Record<string, any>;
}

/**
 * Clase base abstracta para todas las acciones del servidor.
 */
export abstract class BaseServerAction<TData, TState extends StateType<any>> {
  protected config: ActionConfig;
  protected schema?: z.ZodSchema;
  protected apiUrl: string;
  private token?: string;

  constructor(config: ActionConfig) {
    const ENV_API_URL = process.env.API_URL;

    if (!ENV_API_URL || !URL.canParse(ENV_API_URL)) {
      throw new Error("La conexión a la API no está configurada.");
    }
    if (!URL.canParse(config.endpoint, ENV_API_URL)) {
      throw new Error("No se configuró correctamente la ruta del api.");
    }

    this.config = config;
    this.apiUrl = new URL(config.endpoint, ENV_API_URL).href;
  }

  /**
   * Establecer schema de validación Zod.
   */
  protected setSchema(schema: z.ZodSchema) {
    this.schema = schema;
  }

  /**
   * Verifica la sesión de usuario y la autorización.
   *
   * Si la instancia está marcada como solo administrador (admin-only),
   * comprueba si el usuario tiene los permisos necesarios.
   *
   * @returns Una promesa que se resuelve en true si el usuario está autorizado,
   *          false en caso contrario.
   * @throws No lanza excepciones directamente, pero devuelve false en caso de
   *         fallo de autorización.
   *
   */
  private async authorize(): Promise<boolean> {
    const session = await verifySession();
    this.token = session.accessToken;

    if (!this.config.adminOnly) return !!session;
    return verifyAuthorization(session);
  }

  /**
   * Validar los campos de entrada usando schema Zod.
   */
  protected validate(data: Record<string, any>): Record<string, any> {
    if (!this.schema) return data;

    const result = this.schema.safeParse(data);

    if (!result.success) {
      throw {
        type: "VALIDATION_ERROR",
        message: "Validación fallida",
        errors: result.error.flatten().fieldErrors,
      } as ActionError;
    }

    return result.data;
  }

  /**
   * Realiza una solicitud HTTP a la API usando el endpoint y método configurados.
   *
   * Incluye el token de sesión en la cabecera Authorization.
   * Lanza un error tipado si el usuario no está autorizado o si la API responde con error.
   *
   * @param body - (Opcional) Cuerpo de la solicitud, serializado como JSON.
   * @returns Una promesa que se resuelve con los datos de tipo TData obtenidos de la API.
   * @throws ActionError si ocurre un error de autorización, validación o de la API.
   */
  protected async fetchAPI(body?: any): Promise<TData> {
    const authorized = await this.authorize();
    if (!authorized) {
      throw {
        type: "UNAUTHORIZED",
        message: "No tiene permisos para esta acción.",
      } as ActionError;
    }

    const config = {
      method: this.config.method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(this.apiUrl, config);

    if (!response.ok) {
      const error = await response.json();
      throw {
        type: "API_ERROR",
        message:
          ERROR_MESSAGES.get(error.error) ||
          "Error en la comunicación con la API.",
      } as ActionError;
    }

    const result: ResponseAPIType<TData> = await response.json();
    return result.data;
  }

  protected async fetchAPIWithFormData(body?: FormData): Promise<TData> {
    const authorized = await this.authorize();
    if (!authorized) {
      throw {
        type: "UNAUTHORIZED",
        message: "No tiene permisos para esta acción.",
      } as ActionError;
    }

    const config = {
      method: this.config.method,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body,
    };

    const response = await fetch(this.apiUrl, config);

    if (!response.ok) {
      const error = await response.json();
      throw {
        type: "API_ERROR",
        message:
          ERROR_MESSAGES.get(error.error) ||
          "Error en la comunicación con la API.",
      } as ActionError;
    }

    const result: ResponseAPIType<TData> = await response.json();
    return result.data;
  }

  /**
   * Revalidar paths después de la acción
   */
  protected async revalidate(): Promise<void> {
    if (!this.config.revalidatePathAfter?.length) return;

    for (const path of this.config.revalidatePathAfter) {
      revalidatePath(path);
    }
  }

  /**
   * Manejar errores y convertir a estado
   */
  protected handleError(error: unknown): TState {
    let actionError: ActionError;

    if (error instanceof Error && "type" in error) {
      actionError = error as ActionError;
    } else {
      actionError = {
        type: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Error desconocido",
      };
    }

    const errorState = {
      errors: {
        success: [actionError.message],
        ...actionError.errors,
      },
    } as TState;

    return errorState;
  }

  /**
   * Método abstracto que debe implementar cada acción
   */
  abstract execute(prevState: TState, formData: FormData): Promise<TState>;
}
