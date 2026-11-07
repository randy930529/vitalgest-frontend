import { SupplyAmbulanceType, SupplyPharmacyType } from "@/app/lib/definitions";
import {
  fetchSuppliesByAmbulanceId,
  fetchSuppliesByPharmacyId,
} from "@/app/lib/data/supplies";

export class InventoryStock {
  private readonly _pharmacySupplies: Map<string, SupplyPharmacyType>;
  private readonly _ambulanceSupplies: Map<string, SupplyAmbulanceType>;

  constructor(
    private readonly pharmacyId: string,
    private readonly ambulanceId: string,
  ) {
    this._pharmacySupplies = new Map();
    this._ambulanceSupplies = new Map();
  }

  async fetchInventoryStock(): Promise<void> {
    try {
      const [pharmacySupplies, ambulanceSupplies] = await Promise.all([
        fetchSuppliesByPharmacyId(this.pharmacyId).then(
          (result) => result.data,
        ),
        fetchSuppliesByAmbulanceId(this.ambulanceId).then(
          (result) => result.data,
        ),
      ]);

      if (pharmacySupplies.length === 0) {
        throw new Error("No hay suministros disponibles en la farmacia.");
      }

      pharmacySupplies.forEach((supply) => {
        this._pharmacySupplies.set(supply.id, supply);
      });
      ambulanceSupplies.forEach((supply) => {
        this._ambulanceSupplies.set(supply.id, supply);
      });
    } catch (error) {
      console.error("Error fetching inventory stock:", error);
      throw new Error(
        "Fallo al obtener el inventario de suministros. Por favor, inténtelo de nuevo más tarde.",
      );
    }
  }

  get pharmacySupplies(): SupplyPharmacyType[] {
    return Array.from(this._pharmacySupplies.values());
  }

  get ambulanceSupplies(): SupplyAmbulanceType[] {
    return Array.from(this._ambulanceSupplies.values());
  }

  /**
   * Obtiene un suministro del inventario.
   *
   * @param id El ID del suministro que se desea obtener.
   * @param type El tipo de suministro que se desea obtener ["pharmacy" | "ambulance"].
   * @returns El suministro si se encuentra; de lo contrario, undefined.
   */
  getOneSupplyFromStock(
    id: string,
    type: "pharmacy" | "ambulance",
  ): SupplyPharmacyType | SupplyAmbulanceType | undefined {
    if (type === "pharmacy") return this._pharmacySupplies.get(id);
    if (type === "ambulance") return this._ambulanceSupplies.get(id);
    return undefined;
  }

  set pharmacySupplies(supplies: SupplyPharmacyType[]) {
    supplies.forEach((supply) => {
      this._pharmacySupplies.set(supply.id, supply);
    });
  }

  set ambulanceSupplies(supplies: SupplyAmbulanceType[]) {
    supplies.forEach((supply) => {
      this._ambulanceSupplies.set(supply.id, supply);
    });
  }
}
