import { OrderSupplyType, OrderType } from "@/app/lib/definitions";
import { OrderState } from "@/app/lib/config/stateConfigs";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { UpdateOrder } from "@/app/lib/schemas/order";

export class DeleteOrderAction extends BaseServerAction<OrderType, OrderState> {
  constructor(id: string) {
    super({
      endpoint: `/api/orders/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/orders"],
    });
  }

  async execute(): Promise<OrderState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Pedido eliminado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateOrderAction extends BaseServerAction<
  OrderSupplyType[],
  OrderState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/supply-reports/${id}/supplies`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: [
        "/dashboard/orders",
        `/dashboard/orders/${id}/details`,
      ],
    });
    this.setSchema(UpdateOrder);
  }

  async execute(
    prevState: OrderState,
    formData: FormData,
  ): Promise<OrderState> {
    try {
      const data = this.validate({
        itemId: formData.get("itemId"),
        addedQuantity: Number(formData.get("addedQuantity")),
      });

      await this.fetchAPI({
        items: [data],
      });
      await this.revalidate();

      return { message: "Pedido registrado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class AttendedOrderAction extends BaseServerAction<
  OrderSupplyType[],
  OrderState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/supply-reports/${id}/attend`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: [
        "/dashboard/orders",
        `/dashboard/orders/${id}/details`,
      ],
    });
  }

  async execute(): Promise<OrderState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Pedido atendido exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
