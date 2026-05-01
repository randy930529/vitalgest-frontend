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

export async function createSupplyInPharmacy(
  prevState: SupplyPharmacyState,
  formData: FormData,
): Promise<SupplyPharmacyState> {
  const pharmacyId = formData.get("pharmacy") as string;
  const action = new CreateSupplyInPharmacyAction(pharmacyId);
  return action.execute(prevState, formData);
}

export async function updateSupplyInPharmacy(
  id: string,
  prevState: SupplyPharmacyState,
  formData: FormData,
): Promise<SupplyPharmacyState> {
  const pharmacyId = formData.get("pharmacy") as string;
  const action = new UpdateSupplyInPharmacyAction(id, pharmacyId);
  return action.execute(prevState, formData);
}

export async function deleteSupplyInPharmacy(
  id: string,
  pharmacyId: string,
): Promise<SupplyPharmacyState> {
  const action = new DeleteSupplyInPharmacyAction(id, pharmacyId);
  return action.execute();
}

/*-------------Gestión de insumos en las ambulancias---------------------*/

export async function createSupplyInAmbulance(
  prevState: SupplyAmbulanceState,
  formData: FormData,
): Promise<SupplyAmbulanceState> {
  const ambulanceId = formData.get("ambulance") as string;
  const action = new CreateSupplyInAmbulanceAction(ambulanceId);
  return action.execute(prevState, formData);
}

export async function updateSupplyInAmbulance(
  id: string,
  prevState: SupplyAmbulanceState,
  formData: FormData,
): Promise<SupplyAmbulanceState> {
  const ambulanceId = formData.get("ambulance") as string;
  const action = new UpdateSupplyInAmbulanceAction(id, ambulanceId);
  return action.execute(prevState, formData);
}

export async function deleteSupplyInAmbulance(
  id: string,
  ambulanceId: string,
): Promise<SupplyAmbulanceState> {
  const action = new DeleteSupplyInAmbulanceAction(id, ambulanceId);
  return action.execute();
}
