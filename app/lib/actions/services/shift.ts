import { ShiftType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { ShiftState } from "@/app/lib/config/stateConfigs";
import { CreateShift } from "@/app/lib/schema";

export class CreateShiftAction extends BaseServerAction<ShiftType, ShiftState> {
  constructor() {
    super({
      endpoint: "/api/shifts/create",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
    this.setSchema(CreateShift);
  }

  async execute(
    prevState: ShiftState,
    formData: FormData,
  ): Promise<ShiftState> {
    try {
      const data = this.validate({
        ambulanceId: formData.get("ambulance"),
        guardId: formData.get("guard"),
        paramedicalId: formData.get("paramedical"),
        driverId: formData.get("driver"),
      });

      const shift = await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Turno asignado exitosamente.", shift };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateShiftAction extends BaseServerAction<ShiftType, ShiftState> {
  constructor(id: string) {
    super({
      endpoint: `/api/shifts/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
    this.setSchema(CreateShift);
  }

  async execute(
    prevState: ShiftState,
    formData: FormData,
  ): Promise<ShiftState> {
    try {
      const data = this.validate({
        ambulanceId: formData.get("ambulance"),
        guardId: formData.get("guard"),
        paramedicalId: formData.get("paramedical"),
        driverId: formData.get("driver"),
      });

      const shift = await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Turno actualizado exitosamente.", shift };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteShiftAction extends BaseServerAction<ShiftType, ShiftState> {
  constructor(id: string) {
    super({
      endpoint: `/api/shifts/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/guards"],
    });
  }

  async execute(): Promise<ShiftState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Turno eliminado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
