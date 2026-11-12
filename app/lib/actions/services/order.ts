import { OrderDetailType, OrderSupplyType } from "@/app/lib/definitions";
import { OrderState } from "@/app/lib/config/stateConfigs";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { UpdateOrder } from "@/app/lib/schemas/order";
import { fetchAmbulanceById } from "@/app/lib/data/ambulances";
import { fetchDelegationById } from "@/app/lib/data/delegations";
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

  constructor(id: string, ambulanceId: string, orders: OrderDetailType[]) {
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
  }

  async execute(): Promise<OrderState> {
    try {
      // TODO: Pedir agregar el dato de la delegacion+farmacia dentro de la orden
      const delegationId = await fetchAmbulanceById(this.ambulanceId).then(
        (ambulance) => ambulance?.delegation.id,
      );

      if (!delegationId) {
        throw new Error("No se pudo obtener la delegación de la ambulancia.");
      }
      const pharmacyId = await fetchDelegationById(delegationId).then(
        (delegation) => delegation?.pharmacy.id,
      );

      if (!pharmacyId) {
        throw new Error("No se pudo obtener la farmacia de la delegación.");
      }
      //

      const inventory = new InventoryStock(pharmacyId, this.ambulanceId);
      await inventory.fetchInventoryStock();
      const administrator = new InventoryAdmin(inventory);

      await administrator.attendOrders(this.orders);

      // Este endpoint cambia el estado del pedido después de ajustar ambos inventarios.
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Pedido atendido exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
