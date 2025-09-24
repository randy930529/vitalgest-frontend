"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateUser, UpdateUser } from "./schema";
import { StateType } from "./definitions";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { verifySession } from "./dal";

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
  const validatedUserFields = CreateUser.safeParse({
    name: formUserData.get("name"),
    lastname: formUserData.get("lastname"),
    email: formUserData.get("email"),
    password: formUserData.get("password"),
    position: formUserData.get("position"),
    role: formUserData.get("role"),
  });

  if (!validatedUserFields.success) {
    return {
      errors: validatedUserFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  const { name, lastname, email, password, position, role } =
    validatedUserFields.data;
  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const session = await verifySession();
    if (!session?.isAuth) redirect("/");
    const apiToken = session?.accessToken;
    // if (!apiUrl /* || !apiToken*/) {
    //   throw new Error(
    //     "Las variables de conexión a la API no están configuradas."
    //   );
    // }
    const endPoint = `${process.env.API_URL}/api/adm/create/user`;
    const bodyContent = {
      name,
      lastname,
      email,
      password,
      role,
      position,
    };

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    };

    const response = await fetch(endPoint, config);

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
    position: formUserData.get("position"),
    state: formUserData.get("state") === "true",
  });

  if (!validatedUserFields.success) {
    console.log("Validation Error:", validatedUserFields.error);
    return {
      errors: validatedUserFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update User.",
    };
  }

  const { name, lastname, email, role, position, state } =
    validatedUserFields.data;

  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const session = await verifySession();
    if (!session?.isAuth) redirect("/");
    const apiToken = session?.accessToken;
    // if (!apiUrl /* || !apiToken*/) {
    //   throw new Error(
    //     "Las variables de conexión a la API no están configuradas."
    //   );
    // }
    const endPoint = `${process.env.API_URL}/api/adm/edit/user/${id}`;
    const bodyContent = {
      name,
      lastname,
      email,
      role,
      state,
      position,
    };

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    };

    const response = await fetch(endPoint, config);

    if (!response.ok) {
      console.log("Response Error:", await response.json());
      return {
        message: (await response.json())["error"],
      };
    }
  } catch (error) {
    console.log("Try Error:", error);
    return { message: "Database Error: Failed to Update User." };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function deleteUser(id: string) {
  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const session = await verifySession();
    if (!session?.isAuth) redirect("/");
    const apiToken = session?.accessToken;
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
