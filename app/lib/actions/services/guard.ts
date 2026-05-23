import { GuardType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { GuardState } from "@/app/lib/config/stateConfigs";
import { CreateGuard, UpdateGuard } from "@/app/lib/schema";

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

      const guard = await this.fetchAPI({ ...data, date });
      await this.revalidate();

      return { message: "Guardia creada exitosamente.", guard };
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
    this.setSchema(UpdateGuard);
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

export class GuardSetStateAction extends BaseServerAction<
  GuardType,
  GuardState
> {
  private guard: GuardType;
  private newState: GuardType["state"];
  constructor(id: string, guard: GuardType, newState: GuardType["state"]) {
    super({
      endpoint: `/api/guards/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
    this.setSchema(CreateGuard);
    this.guard = guard;
    this.newState = newState;
  }

  async execute(prevState: GuardState): Promise<GuardState> {
    try {
      const { guardChief, delegation, date } = this.guard;
      const dateStr = new Date(date).toISOString().split("T")[0];

      await this.fetchAPI({
        delegationId: delegation.id,
        guardChief: guardChief.id,
        date: dateStr,
        state: this.newState,
      });

      await this.revalidate();

      return {
        message: `Guardia ${this.newState.toLowerCase()} exitosamente.`,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
