"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateUser, UpdateUser } from "./schema";
import { ResponseAPIType, StateType } from "./definitions";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type UserState = StateType<{
  name?: string[];
  lastname?: string[];
  email?: string[];
  password?: string[];
  role?: string[];
  state?: string[];
}>;

export async function createUser(
  prevState: UserState,
  formUserData: FormData
): Promise<UserState> {
  console.log(formUserData);
  const validatedUserFields = CreateUser.safeParse({
    name: formUserData.get("name"),
    lastname: formUserData.get("lastname"),
    email: formUserData.get("email"),
    password: formUserData.get("password"),
    role: formUserData.get("role"),
  });

  if (!validatedUserFields.success) {
    return {
      errors: validatedUserFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  const { name, lastname, email, password, role } = validatedUserFields.data;
  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const apiToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkM2JkMTlhLWE1NjQtNDA1NC1iZTNmLTRkYjk5ZTExNjcwMyIsIm5hbWUiOiJEYW5pZWwiLCJsYXN0bmFtZSI6IlppcGEiLCJlbWFpbCI6ImRhbmllbHppcGFAb3V0bG9vay5jb20iLCJyb2xlIjoiZ2VuZXJhbF9hZG1pbiIsInBvc2l0aW9uIjoiZGV2ZWxvcGVyIiwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc1NzQ4MTU4NywiZXhwIjoxNzU3NDg4Nzg3fQ.0k2oDMgIUMQopFts9ZNFcymJmzxvMH6v6T1NL3ZwNk4";

    // if (!apiUrl /* || !apiToken*/) {
    //   throw new Error(
    //     "Las variables de conexión a la API no están configuradas."
    //   );
    // }
    const endPoint = `${process.env.API_URL}/api/adm/create/user`;

    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        lastname,
        email,
        password,
        role,
        position: "employet",
      }),
    });

    if (!response.ok) {
      console.log((await response.json())["error"]);
      return {
        errors: {},
        message: (await response.json())["error"],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      errors: {},
      message: "Failed to Create User.",
    };
  }

  revalidatePath("/dashboard/users");
  console.log("User created successfully.");
  return { errors: {}, message: "User created successfully." };
}

export async function updateUser(
  id: string,
  prevState: UserState,
  formUserData: FormData
): Promise<UserState> {
  const validatedUserFields = UpdateUser.safeParse({
    name: formUserData.get("name"),
    lastname: formUserData.get("lastname"),
    email: formUserData.get("email"),
    password: formUserData.get("password"),
    role: formUserData.get("role"),
    state: formUserData.get("state") === "true",
  });

  if (!validatedUserFields.success) {
    return {
      errors: validatedUserFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update User.",
    };
  }

  const { name, lastname, email, password, role, state } =
    validatedUserFields.data;

  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const apiToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkM2JkMTlhLWE1NjQtNDA1NC1iZTNmLTRkYjk5ZTExNjcwMyIsIm5hbWUiOiJEYW5pZWwiLCJsYXN0bmFtZSI6IlppcGEiLCJlbWFpbCI6ImRhbmllbHppcGFAb3V0bG9vay5jb20iLCJyb2xlIjoiZ2VuZXJhbF9hZG1pbiIsInBvc2l0aW9uIjoiZGV2ZWxvcGVyIiwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc1NzQ4MTU4NywiZXhwIjoxNzU3NDg4Nzg3fQ.0k2oDMgIUMQopFts9ZNFcymJmzxvMH6v6T1NL3ZwNk4";

    // if (!apiUrl /* || !apiToken*/) {
    //   throw new Error(
    //     "Las variables de conexión a la API no están configuradas."
    //   );
    // }
    const endPoint = `${process.env.API_URL}/api/adm/edit/user/${id}`;

    const response = await fetch(endPoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        lastname,
        email,
        password,
        role,
        state,
        position: "employ",
      }),
    });

    if (!response.ok) {
      return {
        message: (await response.json())["error"],
      };
    }
  } catch (error) {
    return { message: "Database Error: Failed to Update User." };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function deleteUser(id: string) {
  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const apiToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkM2JkMTlhLWE1NjQtNDA1NC1iZTNmLTRkYjk5ZTExNjcwMyIsIm5hbWUiOiJEYW5pZWwiLCJsYXN0bmFtZSI6IlppcGEiLCJlbWFpbCI6ImRhbmllbHppcGFAb3V0bG9vay5jb20iLCJyb2xlIjoiZ2VuZXJhbF9hZG1pbiIsInBvc2l0aW9uIjoiZGV2ZWxvcGVyIiwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc1NzQ4MTU4NywiZXhwIjoxNzU3NDg4Nzg3fQ.0k2oDMgIUMQopFts9ZNFcymJmzxvMH6v6T1NL3ZwNk4";

    // if (!apiUrl /* || !apiToken*/) {
    //   throw new Error(
    //     "Las variables de conexión a la API no están configuradas."
    //   );
    // }
    const endPoint = `${process.env.API_URL}/api/adm/delete/user/${id}`;

    const response = await fetch(endPoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    // if (!response.ok) {
    //   return {
    //     errors: {},
    //     message: (await response.json())["error"],
    //   };
    // }
    console.log(id, await response.json());
  } catch (error) {
    // return { errors: {}, message: "Database Error: Failed to Delete User." };
  }

  revalidatePath("/dashboard/users");
  // return { errors: {}, message: "User deleted successfully." };
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
