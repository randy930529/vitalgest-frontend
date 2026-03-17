import { DelegationType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/actions/core/base-action";
import { DelegationState } from "@/app/lib/config/stateConfigs";
import { CreateDelegation, UpdateDelegation } from "@/app/lib/schema";

export class CreateDelegationAction extends BaseServerAction<
  DelegationType,
  DelegationState
> {
  constructor() {
    super({
      endpoint: "/api/delegations/create",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/delegations"],
    });
    this.setSchema(CreateDelegation);
  }

  async execute(
    prevState: DelegationState,
    formData: FormData,
  ): Promise<DelegationState> {
    try {
      const data = this.validate({
        state: formData.get("state"),
        municipality: formData.get("municipality"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Delegación creada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateDelegationAction extends BaseServerAction<
  DelegationType,
  DelegationState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/delegations/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/delegations"],
    });
    this.setSchema(UpdateDelegation);
  }

  async execute(
    prevState: DelegationState,
    formData: FormData,
  ): Promise<DelegationState> {
    try {
      const data = this.validate({
        name: formData.get("name"),
        state: formData.get("state"),
        municipality: formData.get("municipality"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Delegación actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteDelegationAction extends BaseServerAction<
  DelegationType,
  DelegationState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/delegations/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/delegations"],
    });
  }

  async execute(): Promise<DelegationState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Delegación eliminada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
