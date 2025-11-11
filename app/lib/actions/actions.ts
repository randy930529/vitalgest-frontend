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

  private async authorize(): Promise<boolean> {
    const session = await verifySession();
    this.apiToken = session.accessToken;

    if (!this.adminOnly) return true;
    return verifyAuthorization(session);
  }

  /**
   * TODO: Describir metodo
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
      const resut = await response.json();
      // TODO: Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }

    const result: ResponseAPIType<T> = await response.json();
    console.log(result);
    return result.data;
  }

  /**
   * TODO: Describir metodo
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
      const resut = await response.json();
      // TODO: Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }

    const result: ResponseAPIType<T> = await response.json();
    console.log(result);
    return result.data;
  }

  /**
   * TODO: Describir metodo
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
      const resut = await response.json();
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }
  }
}
