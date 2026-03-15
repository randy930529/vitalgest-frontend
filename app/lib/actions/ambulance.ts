"use server";

import { AmbulanceState } from "@/app/lib/config/stateConfigs";
import {
  CreateAmbulanceAction,
  DeleteAmbulanceAction,
  UpdateAmbulanceAction,
} from "@/app/lib/actions/services/ambulance";

// export async function createAmbulance(
//   prevState: AmbulanceState,
//   formAmbulanceData: FormData,
// ): Promise<AmbulanceState> {
//   const validatedAmbulanceFields = CreateAmbulance.safeParse({
//     number: formAmbulanceData.get("number"),
//     brand: formAmbulanceData.get("brand"),
//     model: formAmbulanceData.get("model"),
//     delegationId: formAmbulanceData.get("delegation"),
//   });

//   if (!validatedAmbulanceFields.success) {
//     return {
//       errors: validatedAmbulanceFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     const endPoint = `/api/ambulances/create`;
//     const actions = new ActionsServer<AmbulanceType>(endPoint, true);
//     await actions.create(validatedAmbulanceFields.data);
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/ambulances");
//   return { message: "Ambulancia creada exitosamente." };
// }

export async function createAmbulance(
  prevState: AmbulanceState,
  formData: FormData,
): Promise<AmbulanceState> {
  const action = new CreateAmbulanceAction();
  return action.execute(prevState, formData);
}

// export async function updateAmbulance(
//   id: string,
//   prevState: AmbulanceState,
//   formAmbulanceData: FormData,
// ): Promise<AmbulanceState> {
//   const validatedAmbulanceFields = UpdateAmbulance.safeParse({
//     number: formAmbulanceData.get("number"),
//     brand: formAmbulanceData.get("brand"),
//     model: formAmbulanceData.get("model"),
//     delegationId: formAmbulanceData.get("delegation"),
//   });

//   if (!validatedAmbulanceFields.success) {
//     return {
//       errors: validatedAmbulanceFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     const endPoint = `/api/ambulances/edit/${id}`;
//     const actions = new ActionsServer<AmbulanceType>(endPoint, true);
//     await actions.update(validatedAmbulanceFields.data);
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/ambulances");
//   return { message: "Cambios guardados exitosamente." };
// }

export async function updateAmbulance(
  id: string,
  prevState: AmbulanceState,
  formData: FormData,
): Promise<AmbulanceState> {
  const action = new UpdateAmbulanceAction(id);
  return action.execute(prevState, formData);
}

// export async function deleteAmbulance(id: string) {
//   try {
//     const endPoint = `/api/ambulances/delete/${id}`;
//     const actions = new ActionsServer<AmbulanceType>(endPoint, true);
//     await actions.delete();
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/ambulances");
//   return { message: "Ambulancia eliminada exitosamente." };
// }

export async function deleteAmbulance(id: string): Promise<AmbulanceState> {
  const action = new DeleteAmbulanceAction(id);
  return action.execute();
}
