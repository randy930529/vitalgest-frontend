"use server";

import {
  SupplyPharmacyState,
  SupplyAmbulanceState,
} from "@/app/lib/config/stateConfigs";
import {
  CreateSupplyInAmbulanceAction,
  CreateSupplyInPharmacyAction,
  DeleteSupplyInAmbulanceAction,
  DeleteSupplyInPharmacyAction,
  UpdateSupplyInAmbulanceAction,
  UpdateSupplyInPharmacyAction,
} from "@/app/lib/actions/services/supply";

/*--------------Gestión de insumos en las farmacias----------------------*/

// export async function createSupplyInPharmacy(
//   prevState: SupplyPharmacyState,
//   formDataSupply: FormData,
// ): Promise<SupplyPharmacyState> {
//   const date = formDataSupply.get("expirationDate") as string;

//   const validatedSupplyFields = CreateSupplyPharmacy.safeParse({
//     pharmacyId: formDataSupply.get("pharmacy"),
//     category: formDataSupply.get("category"),
//     specification: formDataSupply.get("specification"),
//     avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
//     expirationDate: new Date(date),
//     measurementUnit: formDataSupply.get("measurementUnit"),
//   });

//   if (!validatedSupplyFields.success) {
//     return {
//       errors: validatedSupplyFields.error.flatten().fieldErrors,
//     };
//   }

//   const pharmacyId = validatedSupplyFields.data.pharmacyId;
//   try {
//     const endPoint = `/api/supplies/create/pharmacy/${pharmacyId}`;
//     const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
//     await actions.create({
//       ...validatedSupplyFields.data,
//       expirationDate: date,
//     });
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
//   return { message: "Insumo agregado exitosamente." };
// }

export async function createSupplyInPharmacy(
  prevState: SupplyPharmacyState,
  formData: FormData,
): Promise<SupplyPharmacyState> {
  const pharmacyId = formData.get("pharmacy") as string;
  const action = new CreateSupplyInPharmacyAction(pharmacyId);
  return action.execute(prevState, formData);
}

// export async function updateSupplyInPharmacy(
//   id: string,
//   prevState: SupplyPharmacyState,
//   formDataSupply: FormData,
// ): Promise<SupplyPharmacyState> {
//   const date = formDataSupply.get("expirationDate") as string;

//   const validatedSupplyFields = UpdateSupplyPharmacy.safeParse({
//     pharmacyId: formDataSupply.get("pharmacy"),
//     category: formDataSupply.get("category"),
//     specification: formDataSupply.get("specification"),
//     avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
//     expirationDate: new Date(date),
//     measurementUnit: formDataSupply.get("measurementUnit"),
//   });

//   if (!validatedSupplyFields.success) {
//     return {
//       errors: validatedSupplyFields.error.flatten().fieldErrors,
//     };
//   }

//   const pharmacyId = validatedSupplyFields.data.pharmacyId;
//   try {
//     const endPoint = `/api/supplies/edit/${id}`;
//     const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
//     await actions.update({
//       ...validatedSupplyFields.data,
//       expirationDate: date,
//     });
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
//   return { message: "Cambios guardados exitosamente." };
// }

export async function updateSupplyInPharmacy(
  id: string,
  prevState: SupplyPharmacyState,
  formData: FormData,
): Promise<SupplyPharmacyState> {
  const pharmacyId = formData.get("pharmacy") as string;
  const action = new UpdateSupplyInPharmacyAction(id, pharmacyId);
  return action.execute(prevState, formData);
}

// export async function deleteSupplyInPharmacy(
//   id: string,
//   pharmacyId: string | number,
// ): Promise<SupplyPharmacyState> {
//   try {
//     const endPoint = `/api/supplies/delete/${id}`;
//     const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
//     await actions.delete();
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath(`/dashboard/supplies/pharmacies?pharmacy=${pharmacyId}`);
//   return { message: "Insumo eliminado exitosamente." };
// }

export async function deleteSupplyInPharmacy(
  id: string,
  pharmacyId: string,
): Promise<SupplyPharmacyState> {
  const action = new DeleteSupplyInPharmacyAction(id, pharmacyId);
  return action.execute();
}

/*-------------Gestión de insumos en las ambulancias---------------------*/

// export async function createSupplyInAmbulance(
//   prevState: SupplyAmbulanceState,
//   formDataSupply: FormData,
// ): Promise<SupplyAmbulanceState> {
//   const validatedSupplyFields = CreateSupplyAmbulance.safeParse({
//     ambulanceId: formDataSupply.get("ambulance"),
//     supplyId: formDataSupply.get("supply"),
//     areaId: Number(formDataSupply.get("area")),
//     avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
//     minQuantity: Number(formDataSupply.get("minQuantity")),
//   });

//   if (!validatedSupplyFields.success) {
//     return {
//       errors: validatedSupplyFields.error.flatten().fieldErrors,
//     };
//   }

//   const ambulanceId = validatedSupplyFields.data.ambulanceId;
//   try {
//     const endPoint = `/api/ambulances/supplies/create/${ambulanceId}`;

//     const actions = new ActionsServer<SupplyAmbulanceType>(endPoint, true);
//     await actions.create({
//       ...validatedSupplyFields.data,
//       avilableQuantity: validatedSupplyFields.data.avaibleQuantity,
//       ambulanceId: undefined,
//     });
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath(`/dashboard/supplies/ambulances?ambulance=${ambulanceId}`);
//   return { message: "Insumo agregado exitosamente." };
// }

export async function createSupplyInAmbulance(
  prevState: SupplyAmbulanceState,
  formData: FormData,
): Promise<SupplyAmbulanceState> {
  const ambulanceId = formData.get("ambulance") as string;
  const action = new CreateSupplyInAmbulanceAction(ambulanceId);
  return action.execute(prevState, formData);
}

// export async function updateSupplyInAmbulance(
//   id: string,
//   prevState: SupplyAmbulanceState,
//   formDataSupply: FormData,
// ): Promise<SupplyAmbulanceState> {
//   const validatedSupplyFields = UpdateSupplyAmbulance.safeParse({
//     ambulanceId: formDataSupply.get("ambulance"),
//     areaId: Number(formDataSupply.get("area")),
//     avaibleQuantity: Number(formDataSupply.get("avaibleQuantity")),
//     minQuantity: Number(formDataSupply.get("minQuantity")),
//   });

//   if (!validatedSupplyFields.success) {
//     return {
//       errors: validatedSupplyFields.error.flatten().fieldErrors,
//     };
//   }

//   const ambulanceId = validatedSupplyFields.data.ambulanceId;
//   try {
//     const endPoint = `/api/ambulances/supplies/edit/${id}`;

//     const actions = new ActionsServer<SupplyPharmacyType>(endPoint, true);
//     await actions.update({
//       ...validatedSupplyFields.data,
//     });
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath(`/dashboard/supplies/ambulances?ambulance=${ambulanceId}`);
//   return { message: "Cambios guardados exitosamente." };
// }

export async function updateSupplyInAmbulance(
  id: string,
  prevState: SupplyAmbulanceState,
  formData: FormData,
): Promise<SupplyAmbulanceState> {
  const ambulanceId = formData.get("ambulance") as string;
  const action = new UpdateSupplyInAmbulanceAction(id, ambulanceId);
  return action.execute(prevState, formData);
}

// export async function deleteSupplyInAmbulance(
//   id: string,
//   ambulanceId: string | number,
// ): Promise<SupplyAmbulanceState> {
//   try {
//     const endPoint = `/api/ambulances/supplies/delete/${id}`;
//     const actions = new ActionsServer<SupplyAmbulanceType>(endPoint, true);
//     await actions.delete();
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath(`/dashboard/supplies/ambulances?ambulance=${ambulanceId}`);
//   return { message: "Insumo eliminado exitosamente." };
// }

export async function deleteSupplyInAmbulance(
  id: string,
  ambulanceId: string,
): Promise<SupplyAmbulanceState> {
  const action = new DeleteSupplyInAmbulanceAction(id, ambulanceId);
  return action.execute();
}
