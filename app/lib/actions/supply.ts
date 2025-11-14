"use server";

import { revalidatePath } from "next/cache";
import { StateType, SupplyType } from "@/app/lib/definitions";
import { CreateSupply, UpdateSupply } from "@/app/lib/schema";
import { ActionsServer } from "@/app/lib/actions/actions";

export type SupplyState = StateType<{
  pharmacy?: string[];
  category?: string[];
  specification?: string[];
  avaibleQuantity?: string[];
  expirationDate?: string[];
  measurementUnit?: string[];
  notes?: string[];
  success?: string[];
}>;

export async function createSupply(
  prevState: SupplyState,
  formDataSupply: FormData
): Promise<SupplyState> {
  const date = formDataSupply.get("expirationDate") as string;

  const validatedSupplyFields = CreateSupply.safeParse({
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
    const actions = new ActionsServer<SupplyType>(endPoint, true);
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

export async function updateSupply(
  id: string,
  prevState: SupplyState,
  formDataSupply: FormData
): Promise<SupplyState> {
  const date = formDataSupply.get("expirationDate") as string;

  const validatedSupplyFields = UpdateSupply.safeParse({
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
    const actions = new ActionsServer<SupplyType>(endPoint, true);
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

export async function deleteSupply(
  id: string,
  pharmacyId: string | number
): Promise<SupplyState> {
  try {
    const endPoint = `/api/supplies/delete/${id}`;
    const actions = new ActionsServer<SupplyType>(endPoint, true);
    await actions.delete();
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
  return { message: "Insumo eliminada exitosamente." };
}
