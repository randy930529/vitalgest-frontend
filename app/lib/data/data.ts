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

  private async authorize(): Promise<boolean> {
    const session = await verifySession();
    this.apiToken = session.accessToken;

    if (!this.adminOnly) return true;
    return verifyAuthorization(session);
  }

  /**
   * TODO: Describir metodo
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

    const response = await fetch(this.apiUrl + this.endPoint, config);
    if (!response.ok) return;

    const result: ResponseAPIType<T> = await response.json();
    console.log(result);
    return result.data;
  }

  /**
   * TODO: Describir metodo
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
      const response = await fetch(this.apiUrl + this.endPoint, config);

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
