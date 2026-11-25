import { OrderDetailType, OrderSupplyType } from "@/app/lib/definitions";
import { OrderState } from "@/app/lib/config/stateConfigs";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { UpdateOrder } from "@/app/lib/schemas/order";
import { InventoryStock } from "@/app/lib/controllers/inventory-stock";
import { InventoryAdmin } from "@/app/lib/controllers/inventory-admin";

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
      return this.handleError(error, formData);
    }
  }
}

export class AttendedOrderAction extends BaseServerAction<
  OrderSupplyType[],
  OrderState
> {
  private readonly ambulanceId: string;
  private readonly orders: OrderDetailType[];
  private readonly pharmacyId: string;

  constructor(
    id: string,
    ambulanceId: string,
    pharmacyId: string,
    orders: OrderDetailType[],
  ) {
    super({
      endpoint: `/api/supply-reports/${id}/attend`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: [
        "/dashboard/orders",
        `/dashboard/orders/${id}/details`,
      ],
    });
    this.ambulanceId = ambulanceId;
    this.orders = orders;
    this.pharmacyId = pharmacyId;
  }

  async execute(): Promise<OrderState> {
    try {
      const inventory = new InventoryStock(this.pharmacyId, this.ambulanceId);
      await inventory.fetchInventoryStock();
      const administrator = new InventoryAdmin(inventory);

      console.log(inventory.ambulanceSupplies, inventory.pharmacySupplies);

      await administrator.attendOrders(this.orders);

      // Cambia el estado del pedido después de ajustar ambos inventarios.
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Pedido atendido exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
