import { UserType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { UserState } from "@/app/lib/config/stateConfigs";
import { CreateUser, UpdateUser } from "@/app/lib/schema";

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

      await this.fetchAPI({ ...data, delegationId: data.delegation });
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
