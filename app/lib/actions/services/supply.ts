import { SupplyAmbulanceType, SupplyPharmacyType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import {
  SupplyAmbulanceState,
  SupplyPharmacyState,
} from "@/app/lib/config/stateConfigs";
import {
  CreateSupplyAmbulance,
  CreateSupplyPharmacy,
  UpdateSupplyAmbulance,
  UpdateSupplyPharmacy,
} from "@/app/lib/schema";

/*--------------Gestión de insumos en las farmacias----------------------*/
export class CreateSupplyInPharmacyAction extends BaseServerAction<
  SupplyPharmacyType,
  SupplyPharmacyState
> {
  constructor(pharmacyId: string) {
    super({
      endpoint: `/api/supplies/create/pharmacy/${pharmacyId}`,
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: [`/dashboard/supplies/pharmacies/${pharmacyId}`],
    });
    this.setSchema(CreateSupplyPharmacy);
  }

  async execute(
    prevState: SupplyPharmacyState,
    formData: FormData,
  ): Promise<SupplyPharmacyState> {
    try {
      const expirationDate = formData.get("expirationDate") as string;
      const data = this.validate({
        category: formData.get("category"),
        specification: formData.get("specification"),
        avaibleQuantity: Number(formData.get("avaibleQuantity")),
        expirationDate: new Date(expirationDate),
        measurementUnit: formData.get("measurementUnit"),
      });

      await this.fetchAPI({ ...data, expirationDate });
      await this.revalidate();

      return { message: "Insumo agregado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateSupplyInPharmacyAction extends BaseServerAction<
  SupplyPharmacyType,
  SupplyPharmacyState
> {
  constructor(id: string, pharmacyId: string) {
    super({
      endpoint: `/api/supplies/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: [`/dashboard/supplies/pharmacies/${pharmacyId}`],
    });
    this.setSchema(UpdateSupplyPharmacy);
  }

  async execute(
    prevState: SupplyPharmacyState,
    formData: FormData,
  ): Promise<SupplyPharmacyState> {
    try {
      const expirationDate = formData.get("expirationDate") as string;
      const data = this.validate({
        pharmacyId: formData.get("pharmacy"),
        category: formData.get("category"),
        specification: formData.get("specification"),
        avaibleQuantity: Number(formData.get("avaibleQuantity")),
        expirationDate: new Date(expirationDate),
        measurementUnit: formData.get("measurementUnit"),
      });

      await this.fetchAPI({ ...data, expirationDate });
      await this.revalidate();

      return { message: "Insumo actualizado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteSupplyInPharmacyAction extends BaseServerAction<
  SupplyPharmacyType,
  SupplyPharmacyState
> {
  constructor(id: string, pharmacyId: string) {
    super({
      endpoint: `/api/supplies/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: [
        `/dashboard/supplies/pharmacies?pharmacy=${pharmacyId}`,
      ],
    });
  }

  async execute(): Promise<SupplyPharmacyState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Insumo eliminado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

/*--------------Gestión de insumos en las ambulancias----------------------*/
export class CreateSupplyInAmbulanceAction extends BaseServerAction<
  SupplyAmbulanceType,
  SupplyAmbulanceState
> {
  constructor(ambulanceId: string) {
    super({
      endpoint: `/api/ambulances/supplies/create/${ambulanceId}`,
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: [
        `/dashboard/supplies/ambulances?ambulance=${ambulanceId}`,
      ],
    });
    this.setSchema(CreateSupplyAmbulance);
  }

  async execute(
    prevState: SupplyAmbulanceState,
    formData: FormData,
  ): Promise<SupplyAmbulanceState> {
    try {
      const data = this.validate({
        ambulanceId: formData.get("ambulance"),
        supplyId: formData.get("supply"),
        areaId: Number(formData.get("area")),
        avaibleQuantity: Number(formData.get("avaibleQuantity")),
        minQuantity: Number(formData.get("minQuantity")),
      });

      await this.fetchAPI({
        ...data,
        avilableQuantity: data.avaibleQuantity,
        ambulanceId: data.ambulanceId,
      });
      await this.revalidate();

      return { message: "Insumo agregado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateSupplyInAmbulanceAction extends BaseServerAction<
  SupplyAmbulanceType,
  SupplyAmbulanceState
> {
  constructor(id: string, ambulanceId: string) {
    super({
      endpoint: `/api/ambulances/supplies/edit/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: [
        `/dashboard/supplies/ambulances?ambulance=${ambulanceId}`,
      ],
    });
    this.setSchema(UpdateSupplyAmbulance);
  }

  async execute(
    prevState: SupplyAmbulanceState,
    formData: FormData,
  ): Promise<SupplyAmbulanceState> {
    try {
      const data = this.validate({
        ambulanceId: formData.get("ambulance"),
        areaId: Number(formData.get("area")),
        avaibleQuantity: Number(formData.get("avaibleQuantity")),
        minQuantity: Number(formData.get("minQuantity")),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Insumo actualizado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteSupplyInAmbulanceAction extends BaseServerAction<
  SupplyAmbulanceType,
  SupplyAmbulanceState
> {
  constructor(id: string, ambulanceId: string) {
    super({
      endpoint: `/api/ambulances/supplies/delete/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: [
        `/dashboard/supplies/ambulances?ambulance=${ambulanceId}`,
      ],
    });
  }

  async execute(): Promise<SupplyAmbulanceState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Insumo eliminado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
