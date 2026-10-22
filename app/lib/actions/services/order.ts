import { OrderType } from "@/app/lib/definitions";
import { OrderState } from "@/app/lib/config/stateConfigs";
import { BaseServerAction } from "@/app/lib/core/base-action";

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
