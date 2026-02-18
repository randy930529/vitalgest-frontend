"use server";

import { revalidatePath } from "next/cache";
import { SupplyAmbulanceType, SupplyPharmacyType } from "@/app/lib/definitions";
import {
  CreateSupplyInAmbulance,
  CreateSupplyInPharmacy,
  UpdateSupplyInAmbulance,
  UpdateSupplyInPharmacy,
} from "@/app/lib/schema";
import { ActionsServer } from "@/app/lib/actions/actions";
import {
  SupplyInPharmacyState,
  SupplyInAmbulanceState,
} from "@/app/lib/config/stateConfigs";

/*--------------Gestión de insumos en las farmacias----------------------*/
export async function createSupplyInPharmacy(
  prevState: SupplyInPharmacyState,
  formDataSupply: FormData,
): Promise<SupplyInPharmacyState> {
  const date = formDataSupply.get("expirationDate") as string;

  const validatedSupplyFields = CreateSupplyInPharmacy.safeParse({
    pharmacyId: formDataSupply.get("pharmacy"),
    category: formDataSupply.get("category"),
    specification: formDataSupply.get("specification"),
    avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
    expirationDate: new Date(date),
    measurementUnit: formDataSupply.get("measurementUnit"),
  });

  if (!validatedSupplyFields.success) {
    return {
      errors: validatedSupplyFields.error.flatten().fieldErrors,
    };
  }

  const pharmacyId = validatedSupplyFields.data.pharmacyId;
  try {
    const endPoint = `/api/supplies/create/pharmacy/${pharmacyId}`;
    const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
    await actions.create({
      ...validatedSupplyFields.data,
      expirationDate: date,
    });
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
  return { message: "Insumo agregado exitosamente." };
}

export async function updateSupplyInPharmacy(
  id: string,
  prevState: SupplyInPharmacyState,
  formDataSupply: FormData,
): Promise<SupplyInPharmacyState> {
  const date = formDataSupply.get("expirationDate") as string;

  const validatedSupplyFields = UpdateSupplyInPharmacy.safeParse({
    pharmacyId: formDataSupply.get("pharmacy"),
    category: formDataSupply.get("category"),
    specification: formDataSupply.get("specification"),
    avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
    expirationDate: new Date(date),
    measurementUnit: formDataSupply.get("measurementUnit"),
  });

  if (!validatedSupplyFields.success) {
    return {
      errors: validatedSupplyFields.error.flatten().fieldErrors,
    };
  }

  const pharmacyId = validatedSupplyFields.data.pharmacyId;
  try {
    const endPoint = `/api/supplies/edit/${id}`;
    const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
    await actions.update({
      ...validatedSupplyFields.data,
      expirationDate: date,
    });
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteSupplyInPharmacy(
  id: string,
  pharmacyId: string | number,
): Promise<SupplyInPharmacyState> {
  try {
    const endPoint = `/api/supplies/delete/${id}`;
    const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
    await actions.delete();
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/pharmacies?pharmacy=${pharmacyId}`);
  return { message: "Insumo eliminado exitosamente." };
}

/*-------------Gestión de insumos en las ambulancias---------------------*/
export async function createSupplyInAmbulance(
  prevState: SupplyInAmbulanceState,
  formDataSupply: FormData,
): Promise<SupplyInAmbulanceState> {
  const validatedSupplyFields = CreateSupplyInAmbulance.safeParse({
    ambulanceId: formDataSupply.get("ambulance"),
    supplyId: formDataSupply.get("supply"),
    areaId: Number(formDataSupply.get("area")),
    avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
    minQuantity: Number(formDataSupply.get("minQuantity")),
  });

  if (!validatedSupplyFields.success) {
    return {
      errors: validatedSupplyFields.error.flatten().fieldErrors,
    };
  }

  const ambulanceId = validatedSupplyFields.data.ambulanceId;
  try {
    const endPoint = `/api/ambulances/supplies/create/${ambulanceId}`;

    const actions = new ActionsServer<SupplyAmbulanceType>(endPoint, true);
    await actions.create({
      ...validatedSupplyFields.data,
      avilableQuantity: validatedSupplyFields.data.avaibleQuantity,
      ambulanceId: undefined,
    });
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/ambulances?ambulance=${ambulanceId}`);
  return { message: "Insumo agregado exitosamente." };
}

export async function updateSupplyInAmbulance(
  id: string,
  prevState: SupplyInAmbulanceState,
  formDataSupply: FormData,
): Promise<SupplyInAmbulanceState> {
  const validatedSupplyFields = UpdateSupplyInAmbulance.safeParse({
    ambulanceId: formDataSupply.get("ambulance"),
    areaId: Number(formDataSupply.get("area")),
    avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
    minQuantity: Number(formDataSupply.get("minQuantity")),
  });

  if (!validatedSupplyFields.success) {
    return {
      errors: validatedSupplyFields.error.flatten().fieldErrors,
    };
  }

  const ambulanceId = validatedSupplyFields.data.ambulanceId;
  try {
    const endPoint = `/api/ambulances/supplies/edit/${id}`;

    const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
    await actions.update({
      ...validatedSupplyFields.data,
    });
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/ambulances?ambulance=${ambulanceId}`);
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteSupplyInAmbulance(
  id: string,
  ambulanceId: string | number,
): Promise<SupplyInAmbulanceState> {
  try {
    const endPoint = `/api/ambulances/supplies/delete/${id}`;
    const actions = new ActionsServer<SupplyAmbulanceType>(endPoint, true);
    await actions.delete();
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/ambulances?ambulance=${ambulanceId}`);
  return { message: "Insumo eliminado exitosamente." };
}
