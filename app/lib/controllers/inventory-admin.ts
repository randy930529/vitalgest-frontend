import {
  OrderDetailType,
  SupplyAmbulanceType,
  SupplyPharmacyType,
} from "@/app/lib/definitions";
import { InventoryStock } from "@/app/lib/controllers/inventory-stock";
import {
  updateSupplyInAmbulance,
  updateSupplyInPharmacy,
} from "@/app/lib/actions/supply";
import {
  SupplyAmbulanceState,
  SupplyPharmacyState,
} from "@/app/lib/config/stateConfigs";

export class InventoryAdmin {
  private notebookInventory: string[] = [];

  constructor(private readonly inventoryStock: InventoryStock) {}

  private async setSupplyInPharmacy({
    supply,
    quantity,
  }: {
    supply: SupplyPharmacyType;
    quantity: number;
  }) {
    return this.updateSupply({
      supply,
      quantity,
      update: (id, formData) =>
        updateSupplyInPharmacy(id, { errors: {}, message: null }, formData),
      errorMessage: "Error al actualizar el suministro en la farmacia.",
    });
  }

  private async setSupplyInAmbulance({
    supply,
    quantity,
  }: {
    supply: SupplyAmbulanceType;
    quantity: number;
  }) {
    return this.updateSupply({
      supply,
      quantity,
      update: (id, formData) =>
        updateSupplyInAmbulance(id, { errors: {}, message: null }, formData),
      errorMessage: "Error al actualizar el suministro en la ambulancia.",
    });
  }

  private async updateSupply({
    supply,
    quantity,
    update,
    errorMessage,
  }: {
    supply: SupplyPharmacyType | SupplyAmbulanceType;
    quantity: number;
    update: (
      id: string,
      formData: FormData,
    ) => Promise<SupplyPharmacyState | SupplyAmbulanceState>;
    errorMessage: string;
  }) {
    try {
      if (!supply) return;
      if (quantity < 1) {
        throw new Error("La cantidad del suministro no puede ser menor a 1.");
      }

      // Registrar el suministro en el cuaderno de inventario.
      this.notebookInventory.push(supply.id);

      return await update(supply.id, this.getFormData(supply));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : errorMessage);
    }
  }

  /**
   * Convierte un objeto en un FormData.
   *
   * @param object El objeto que se desea convertir en FormData.
   * @returns Un objeto FormData que contiene las propiedades del objeto original.
   */
  private getFormData(object: Record<string, any>): FormData {
    const formData = new FormData();
    for (const [key, value] of Object.entries(object)) {
      formData.append(key, value);
    }
    return formData;
  }

  private async auditInventory() {
    try {
      this.notebookInventory.forEach(async (supplyId) => {
        const pharmacySupply = this.inventoryStock.getOneSupplyFromStock(
          supplyId,
          "pharmacy",
        );
        const ambulanceSupply = this.inventoryStock.getOneSupplyFromStock(
          supplyId,
          "ambulance",
        );

        if (!pharmacySupply || !ambulanceSupply) return;

        await Promise.all([
          this.setSupplyInPharmacy({
            supply: pharmacySupply as SupplyPharmacyType,
            quantity: pharmacySupply.avaible_quantity,
          }),
          this.setSupplyInAmbulance({
            supply: ambulanceSupply as SupplyAmbulanceType,
            quantity: ambulanceSupply.avaible_quantity,
          }),
        ]);
      });
    } catch (error) {
      console.error("Error al auditar el inventario:", error);
      throw new Error("Fallo en la auditoría de inventario.");
    }
  }

  async attendOrders(orders: OrderDetailType[]) {
    // TODO: Resolver en el backend los id de los suministros en farmacia,
    // ambulancia y pedido deben ser el mismo.
    try {
      orders.forEach(async ({ supplies }) => {
        supplies.forEach(async (supply) => {
          const pharmacySupply = this.inventoryStock.getOneSupplyFromStock(
            supply.id,
            "pharmacy",
          );
          const ambulanceSupply = this.inventoryStock.getOneSupplyFromStock(
            supply.id,
            "ambulance",
          );

          if (!pharmacySupply)
            throw new Error(
              `No hay "${supply.category}" disponibles en la farmacia.`,
            );

          if (!ambulanceSupply)
            throw new Error(
              `El suministro "${supply.category}" no está asignado en la ambulancia.`,
            );

          if (pharmacySupply.avaible_quantity < supply.added_quantity)
            throw new Error(
              `No hay suficientes "${supply.category}" en la farmacia para cubrir el pedido.`,
            );

          await Promise.all([
            this.setSupplyInPharmacy({
              supply: pharmacySupply as SupplyPharmacyType,
              quantity: pharmacySupply.avaible_quantity - supply.added_quantity,
            }),
            this.setSupplyInAmbulance({
              supply: ambulanceSupply as SupplyAmbulanceType,
              quantity:
                ambulanceSupply.avaible_quantity + supply.added_quantity,
            }),
          ]);
        });
      });
    } catch (error) {
      this.auditInventory();

      throw new Error(
        error instanceof Error
          ? error.message
          : "No pudimos atender el pedido.",
      );
    } finally {
      this.notebookInventory = [];
    }
  }
}
