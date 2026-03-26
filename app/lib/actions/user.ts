"use server";

import { UserState } from "@/app/lib/config/stateConfigs";
import {
  CreateUserAction,
  DeleteUserAction,
  UpdateProfileAction,
  UpdateUserAction,
} from "@/app/lib/actions/services/user";

// export async function createUser(
//   prevState: UserState,
//   formUserData: FormData,
// ): Promise<UserState> {
//   const validatedUserFields = CreateUser.safeParse({
//     name: formUserData.get("name"),
//     lastname: formUserData.get("lastname"),
//     email: formUserData.get("email"),
//     password: formUserData.get("password"),
//     position: formUserData.get("position"),
//     role: formUserData.get("role"),
//     delegation: formUserData.get("delegation"),
//   });

//   try {
//     const endPoint = `/api/adm/create/user`;
//     // const actions = new ActionsServer<UserType,UserState>({endPoint, schema: CreateUser, adminOnly: true});
//     // await actions.create({
//     //   ...validatedUserFields.data,
//     //   delegationId: delegation,
//     // });
//     const createUserAction = new CreateUserAction();
//     await createUserAction.execute(prevState, formUserData);
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/users");
//   return { message: "Usuario creado exitosamente." };
// }

export async function createUser(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const action = new CreateUserAction();
  return action.execute(prevState, formData);
}

// export async function updateUser(
//   id: string,
//   prevState: UserState,
//   formUserData: FormData,
// ): Promise<UserState> {
//   const userFields = UpdateUser.safeParse({
//     name: formUserData.get("name"),
//     lastname: formUserData.get("lastname"),
//     email: formUserData.get("email"),
//     password: formUserData.get("password"),
//     role: formUserData.get("role"),
//     position: formUserData.get("position"),
//     status: formUserData.get("status") === "on",
//     delegation: formUserData.get("delegation"),
//   });

//   if (!validatedUserFields.success) {
//     return {
//       errors: validatedUserFields.error.flatten().fieldErrors,
//     };
//   }

//   try {
//     const { delegation } = validatedUserFields.data;
//     const endPoint = `/api/adm/edit/user/${id}`;
//     const actions = new ActionsServer<UserType, UserState>({
//       endPoint,
//       adminOnly: true,
//       schema,
//     });
//     await actions.update({
//       ...validatedUserFields.data,
//       delegationId: delegation,
//     });
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/users");
//   return { message: "Cambios guardados exitosamente." };
// }

export async function updateUser(
  id: string,
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const action = new UpdateUserAction(id);
  return action.execute(prevState, formData);
}

// export async function deleteUser(id: string): Promise<UserState> {
//   try {
//     const endPoint = `/api/adm/delete/user/${id}`;
//     const actions = new ActionsServer<UserType>(endPoint, true);
//     await actions.delete();
//   } catch (error) {
//     return {
//       errors: {
//         success: [error instanceof Error ? error.message : String(error)],
//       },
//     };
//   }

//   revalidatePath("/dashboard/users");
//   return { message: "Usuario eliminado exitosamente." };
// }

export async function deleteUser(id: string): Promise<UserState> {
  const action = new DeleteUserAction(id);
  return action.execute();
}

export async function updateProfile(
  prevState: UserState,
  formData: FormData,
): Promise<UserState> {
  const action = new UpdateProfileAction();
  return action.execute(prevState, formData);
}
