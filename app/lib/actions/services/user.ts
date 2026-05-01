import { UserType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { UserState } from "@/app/lib/config/stateConfigs";
import { CreateUser, UpdateProfile, UpdateUser } from "@/app/lib/schema";

export class CreateUserAction extends BaseServerAction<UserType, UserState> {
  constructor() {
    super({
      endpoint: "/api/adm/create/user",
      method: "POST",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/users"],
    });
    this.setSchema(CreateUser);
  }

  async execute(prevState: UserState, formData: FormData): Promise<UserState> {
    try {
      const data = this.validate({
        name: formData.get("name"),
        lastname: formData.get("lastname"),
        email: formData.get("email"),
        password: formData.get("password"),
        position: formData.get("position"),
        role: formData.get("role"),
        delegation: formData.get("delegation"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Usuario creado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateUserAction extends BaseServerAction<UserType, UserState> {
  constructor(id: string) {
    super({
      endpoint: `/api/adm/edit/user/${id}`,
      method: "PUT",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/users"],
    });
    this.setSchema(UpdateUser);
  }

  async execute(prevState: UserState, formData: FormData): Promise<UserState> {
    try {
      const data = this.validate({
        name: formData.get("name"),
        lastname: formData.get("lastname"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        position: formData.get("position"),
        status: formData.get("status") === "on",
        delegation: formData.get("delegation"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Usuario actualizado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class DeleteUserAction extends BaseServerAction<UserType, UserState> {
  constructor(id: string) {
    super({
      endpoint: `/api/adm/delete/user/${id}`,
      method: "DELETE",
      adminOnly: true,
      revalidatePathAfter: ["/dashboard/users"],
    });
  }

  async execute(): Promise<UserState> {
    try {
      await this.fetchAPI();
      await this.revalidate();

      return { message: "Usuario eliminado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateProfileAction extends BaseServerAction<UserType, UserState> {
  constructor() {
    super({
      endpoint: "/api/profile/update",
      method: "PUT",
      adminOnly: false,
      revalidatePathAfter: ["/profile", "/profile/edit"],
    });
    this.setSchema(UpdateProfile);
  }

  async execute(prevState: UserState, formData: FormData): Promise<UserState> {
    if (process.env.ENABLE_PROFILE_API !== "true") {
      return {
        errors: {
          success: [
            "La API de perfil aún no está habilitada. La interfaz ya está preparada.",
          ],
        },
      };
    }

    try {
      const data = this.validate({
        name: formData.get("name"),
        lastname: formData.get("lastname"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        avatarFile: formData.get("avatarUrl"),
        signatureFile: formData.get("signatureFile"),
        password: formData.get("password"),
      });

      const bodyFormData = new FormData();
      bodyFormData.append("name", data.name as string);
      bodyFormData.append("lastname", data.lastname as string);
      bodyFormData.append("email", data.email as string);
      bodyFormData.append("avatarFile", data.avatarFile as File);
      bodyFormData.append("signatureFile", data.signatureFile as File);

      await this.fetchAPIWithFormData(bodyFormData);
      await this.revalidate();

      return { message: "Perfil actualizado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
