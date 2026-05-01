import { AmbulanceType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { AmbulanceState } from "@/app/lib/config/stateConfigs";
import { CreateAmbulance, UpdateAmbulance } from "@/app/lib/schema";

export class CreateAmbulanceAction extends BaseServerAction<
  AmbulanceType,
  AmbulanceState
> {
  constructor() {
    super({
      endpoint: "/api/ambulances/create",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/ambulances"],
    });
    this.setSchema(CreateAmbulance);
  }

  async execute(
    prevState: AmbulanceState,
    formData: FormData,
  ): Promise<AmbulanceState> {
    try {
      const data = this.validate({
        number: formData.get("number"),
        brand: formData.get("brand"),
        model: formData.get("model"),
        delegationId: formData.get("delegation"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Ambulancia creada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateAmbulanceAction extends BaseServerAction<
  AmbulanceType,
  AmbulanceState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/ambulances/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/ambulances"],
    });
    this.setSchema(UpdateAmbulance);
  }

  async execute(
    prevState: AmbulanceState,
    formData: FormData,
  ): Promise<AmbulanceState> {
    try {
      const data = this.validate({
        number: formData.get("number"),
        brand: formData.get("brand"),
        model: formData.get("model"),
        delegationId: formData.get("delegation"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Ambulancia actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteAmbulanceAction extends BaseServerAction<
  AmbulanceType,
  AmbulanceState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/ambulances/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/ambulances"],
    });
  }

  async execute(): Promise<AmbulanceState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Ambulancia eliminada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
