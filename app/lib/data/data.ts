import { cache } from "react";
import { verifyAuthorization, verifySession } from "@/app/lib/dal";
import { ResponseAPIType } from "@/app/lib/definitions";

export class DataFetch<T> {
  private endPoint: string;
  private apiUrl: string;
  private adminOnly: boolean;
  private apiToken?: string;

  constructor(endPoint: string, adminOnly: boolean = false) {
    if (!process.env.API_URL || !URL.canParse(process.env.API_URL)) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    this.apiUrl = process.env.API_URL;

    if (!URL.canParse(endPoint, this.apiUrl)) {
      throw new Error("No se configuró correctamente la ruta del api.");
    }

    this.endPoint = new URL(endPoint, this.apiUrl).href;
    this.adminOnly = adminOnly;
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
    this.apiToken = session.accessToken;

    if (!this.adminOnly) return true;
    return verifyAuthorization(session);
  }

  /**
   * Obtiene un único recurso de tipo T desde una ruta de la API.
   *
   * Verifica la autorización del usuario antes de realizar la solicitud. Si la instancia
   * está marcada como solo administrador, asegura que el usuario tenga los permisos necesarios.
   *
   * @returns Una promesa que se resuelve en un único elemento de tipo T, o undefined
   *          si la autorización falla o la solicitud a la API no es exitosa.
   */
  public async getOne(): Promise<T | undefined> {
    const authorizedUser = await this.authorize();
    if (!authorizedUser) return;

    const config = {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(this.endPoint, config);
    if (!response.ok) return;

    const result: ResponseAPIType<T> = await response.json();
    console.log(result);
    return result.data;
  }

  /**
   * Obtiene todos los recursos de tipo T desde la ruta de la API.
   *
   * Verifica la autorización del usuario antes de realizar la solicitud. Si la instancia
   * está marcada como solo administrador (admin-only), asegura que el usuario tenga los
   * permisos necesarios.
   *
   * @returns Una promesa que se resuelve en un arreglo de elementos de tipo T, o un arreglo vacío
   *          si la autorización falla o la solicitud a la API no tiene éxito. Devuelve un arreglo
   *          vacío en caso de fallo de autorización o respuesta fallida de la API.
   */
  public async getAll(): Promise<T[]> {
    const authorizedUser = await this.authorize();
    if (!authorizedUser) return [];

    const fetchFromApi = cache(async (): Promise<ResponseAPIType<T[]>> => {
      const config = {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(this.endPoint, config);

      if (!response.ok) {
        console.log(await response.json());
        return {
          success: false,
          data: [],
          error: "No se pudo obtener las datos desde la API.",
        };
      }

      return response.json();
    });

    const result = await fetchFromApi();
    console.log(result);
    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  }
}
