import { SignatureType, UserType } from "@/app/lib/definitions";
import { BaseServerAction } from "@/app/lib/core/base-action";
import { UploadSignatureState, UserState } from "@/app/lib/config/stateConfigs";
import {
  UpdatePassword,
  UpdateProfile,
  UpdateSignature,
  UploadSignature,
} from "@/app/lib/schemas/profile";

export class UpdateUserPasswordAction extends BaseServerAction<
  UserType,
  UserState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/user/change/password/${id}`,
      method: "PATCH",
      revalidatePathAfter: ["/profile", "/profile/edit"],
    });
    this.setSchema(UpdatePassword);
  }

  async execute(prevState: UserState, formData: FormData): Promise<UserState> {
    try {
      const data = this.validate({
        password: formData.get("password"),
        newPassword: formData.get("newPassword"),
      });

      await this.fetchAPI({
        currentPass: data.password,
        newPass: data.newPassword,
      });
      await this.revalidate();

      return { message: "Contraseña actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateProfileAction extends BaseServerAction<UserType, UserState> {
  constructor(id: string) {
    super({
      endpoint: `/api/user/change/info/${id}`,
      method: "PATCH",
      revalidatePathAfter: ["/profile", "/profile/edit"],
    });
    this.setSchema(UpdateProfile);
  }

  async execute(prevState: UserState, formData: FormData): Promise<UserState> {
    try {
      const data = this.validate({
        name: formData.get("name"),
        lastname: formData.get("lastname"),
        phone: formData.get("phone"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Perfil actualizado exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UploadSignatureAction extends BaseServerAction<
  SignatureType,
  UploadSignatureState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/user/${id}/upload/signature`,
      method: "POST",
      revalidatePathAfter: ["/profile", "/profile/edit"],
    });
    this.setSchema(UploadSignature);
  }

  async execute(
    prevState: UploadSignatureState,
    formData: FormData,
  ): Promise<UploadSignatureState> {
    try {
      const data = this.validate({
        mime: formData.get("mime"),
        ext: formData.get("ext"),
        size: Number(formData.get("size")),
      });

      const signature = await this.fetchAPI(data);

      return { message: "Firma subida exitosamente.", signature };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export class UpdateSignatureAction extends BaseServerAction<
  SignatureType,
  UploadSignatureState
> {
  constructor(id: string) {
    super({
      endpoint: `/api/user/${id}/image/attach`,
      method: "PATCH",
      revalidatePathAfter: ["/profile", "/profile/edit"],
    });
    this.setSchema(UpdateSignature);
  }

  async execute(
    prevState: UploadSignatureState,
    formData: FormData,
  ): Promise<UploadSignatureState> {
    try {
      const data = this.validate({
        key: formData.get("key"),
      });

      await this.fetchAPI(data);
      await this.revalidate();

      return { message: "Firma actualizada exitosamente." };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
