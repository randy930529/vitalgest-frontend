import { ResponseAPIType } from "@/app/lib/definitions";
import { verifyAuthorization, verifySession } from "@/app/lib/dal";

export class ActionsServer<T> {
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
   * Crea un nuevo recurso de tipo T en la ruta de la API.
   *
   * @param bodyContent - El contenido del cuerpo de la solicitud para crear el recurso.
   * @returns Una promesa que se resuelve en el recurso creado de tipo T.
   * @throws Lanza un error si el usuario no está autorizado o si la solicitud falla.
   */
  public async create(bodyContent: any): Promise<T> {
    const authorizedUser = await this.authorize();
    if (!authorizedUser) throw new Error("Usuario no autorizado.");

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    };

    const response = await fetch(this.endPoint, config);
    if (!response.ok) {
      const result = await response.json();
      // TODO: Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      console.log(result);
      let errorMessage = result.error
        ? result.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }

    const result: ResponseAPIType<T> = await response.json();
    console.log(result);
    return result.data;
  }

  /**
   * Actualiza un recurso existente de tipo T en la ruta de la API.
   *
   * @param bodyContent - El contenido del cuerpo de la solicitud para actualizar el recurso.
   * @returns Una promesa que se resuelve en el recurso actualizado de tipo T.
   * @throws Lanza un error si el usuario no está autorizado o si la solicitud falla.
   */
  public async update(bodyContent: any): Promise<T> {
    const authorizedUser = await this.authorize();
    if (!authorizedUser) throw new Error("Usuario no autorizado.");

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    };

    const response = await fetch(this.endPoint, config);

    if (!response.ok) {
      const result = await response.json();
      // TODO: Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = result.error
        ? result.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }

    const result: ResponseAPIType<T> = await response.json();
    console.log(result);
    return result.data;
  }

  /**
   * Elimina un recurso existente de tipo T en la ruta de la API.
   *
   * @returns Una promesa que se resuelve cuando el recurso ha sido eliminado.
   * @throws Lanza un error si el usuario no está autorizado o si la solicitud falla.
   */
  public async delete(): Promise<void> {
    const authorizedUser = await this.authorize();
    if (!authorizedUser) throw new Error("Usuario no autorizado.");

    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(this.endPoint, config);

    if (!response.ok) {
      const result = await response.json();
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = result.error
        ? result.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }
  }
}
