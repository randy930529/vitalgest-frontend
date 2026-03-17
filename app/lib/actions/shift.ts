"use server";

import { ShiftState } from "@/app/lib/config/stateConfigs";
import {
  CreateShiftAction,
  DeleteShiftAction,
  UpdateShiftAction,
} from "@/app/lib/actions/services/shift";

// export async function createShift(
//   prevState: ShiftState,
//   formShiftData: FormData,
// ): Promise<ShiftState> {
//   const validatedShiftFields = CreateShift.safeParse({
//     ambulanceId: formShiftData.get("ambulance"),
//     guardId: formShiftData.get("guard"),
//     paramedicalId: formShiftData.get("paramedical"),
//     driverId: formShiftData.get("driver"),
//   });

//   if (!validatedShiftFields.success) {
//     return {
//       errors: validatedShiftFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     const endPoint = `/api/shifts/create`;
//     const actions = new ActionsServer<ShiftType>(endPoint, true);
//     const response = await actions.create(validatedShiftFields.data);

//     revalidatePath("/dashboard/guards");
//     return { message: "Turno asignado exitosamente.", shift: response };
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }
// }

export async function createShift(
  prevState: ShiftState,
  formData: FormData,
): Promise<ShiftState> {
  const action = new CreateShiftAction();
  return action.execute(prevState, formData);
}

// export async function updateShift(
//   id: string,
//   prevState: ShiftState,
//   formShiftData: FormData,
// ): Promise<ShiftState> {
//   const validatedShiftFields = UpdateShift.safeParse({
//     number: formShiftData.get("number"),
//     brand: formShiftData.get("brand"),
//     model: formShiftData.get("model"),
//     delegationId: formShiftData.get("delegation"),
//   });

//   if (!validatedShiftFields.success) {
//     return {
//       errors: validatedShiftFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     const endPoint = `/api/shifts/edit/${id}`;
//     const actions = new ActionsServer<ShiftType>(endPoint, true);
//     await actions.update(validatedShiftFields.data);
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/shifts");
//   return { message: "Cambios guardados exitosamente." };
// }

export async function updateShift(
  id: string,
  prevState: ShiftState,
  formData: FormData,
): Promise<ShiftState> {
  const action = new UpdateShiftAction(id);
  return action.execute(prevState, formData);
}

// export async function deleteShift(id: string) {
//   try {
//     const endPoint = `/api/shifts/delete/${id}`;
//     const actions = new ActionsServer<ShiftType>(endPoint, true);
//     await actions.delete();
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/shifts");
//   return { message: "Ambulancia eliminada exitosamente." };
// }

export async function deleteShift(id: string): Promise<ShiftState> {
  const action = new DeleteShiftAction(id);
  return action.execute();
}
