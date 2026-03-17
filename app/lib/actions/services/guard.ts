import { GuardType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/actions/core/base-action";
import { GuardState } from "@/app/lib/config/stateConfigs";
import { CreateGuard } from "@/app/lib/schema";

export class CreateGuardAction extends BaseServerAction<GuardType, GuardState> {
  constructor() {
    super({
      endpoint: "/api/guards/create",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
    this.setSchema(CreateGuard);
  }

  async execute(
    prevState: GuardState,
    formData: FormData,
  ): Promise<GuardState> {
    try {
      const date = formData.get("date") as string;
      const data = this.validate({
        delegationId: formData.get("delegation"),
        guardChief: formData.get("guardChief"),
        date: new Date(date),
      });

      await this.fetchAPI({ ...data, date });
      await this.revalidate();

      return { message: "Guardia creada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateGuardAction extends BaseServerAction<GuardType, GuardState> {
  constructor(id: string) {
    super({
      endpoint: `/api/guards/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
    this.setSchema(CreateGuard);
  }

  async execute(
    prevState: GuardState,
    formData: FormData,
  ): Promise<GuardState> {
    try {
      const date = formData.get("date") as string;
      const data = this.validate({
        delegationId: formData.get("delegation"),
        guardChief: formData.get("guardChief"),
        date: new Date(date),
        state: formData.get("state"),
      });

      await this.fetchAPI({ ...data, date });
      await this.revalidate();

      return { message: "Guardia actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteGuardAction extends BaseServerAction<GuardType, GuardState> {
  constructor(id: string) {
    super({
      endpoint: `/api/guards/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
  }

  async execute(): Promise<GuardState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Guardia eliminada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class CloseGuardAction extends BaseServerAction<GuardType, GuardState> {
  private guard: GuardType;
  constructor(id: string, guard: GuardType) {
    super({
      endpoint: `/api/guards/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
    this.setSchema(CreateGuard);
    this.guard = guard;
  }

  async execute(prevState: GuardState): Promise<GuardState> {
    try {
      const { guardChief, delegation, state, date } = this.guard;
      const dateStr = new Date(date).toISOString().split("T")[0];

      await this.fetchAPI({
        delegationId: delegation.id,
        guardChief: guardChief.id,
        date: dateStr,
        state,
      });

      await this.revalidate();

      return { message: "Guardia cerrada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
