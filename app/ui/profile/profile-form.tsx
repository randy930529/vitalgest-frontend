"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/lib/actions/user";
import { UserState } from "@/app/lib/config/stateConfigs";
import {
  ImageUploaderValue,
  ProfileFormData,
  UserType,
} from "@/app/lib/definitions";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { ProfileEditView } from "@/app/ui/components/profile/ProfileEditView";

type UserProfileExtra = {
  phone?: string;
  avatarUrl?: string;
  firmaUrl?: string;
  signatureUrl?: string;
};

export default function ProfileForm({ user }: { user: UserType }) {
  const router = useRouter();
  const profileUser = user as UserType & UserProfileExtra;
  const cancelPath =
    profileUser.role === "admin" || profileUser.role === "general_admin"
      ? "/dashboard"
      : "/";

  const [password, setPassword] = useState("");
  const [formValue, setFormValue] = useState<ProfileFormData>({
    name: profileUser.name || "",
    lastname: profileUser.lastname || "",
    position: profileUser.position || "",
    role: profileUser.role || "",
    status: profileUser.status,
    email: profileUser.email || "",
    phone: profileUser.phone || "",
    delegation: profileUser.delegation?.name || "",
    avatar: profileUser.avatarUrl || null,
    signature:
      profileUser.signatureUrl ||
      profileUser.firmaUrl ||
      "/images/logo-vital-gest_red.svg",
  });

  const initialState: UserState = { errors: {}, message: null };
  const [state, formAction] = useActionState(updateProfile, initialState);

  useFormNotifications({ state });

  function updateField<K extends keyof ProfileFormData>(
    field: K,
    nextValue: ProfileFormData[K],
  ) {
    setFormValue((prev) => ({ ...prev, [field]: nextValue }));
  }

  function appendImageValueToFormData(
    data: FormData,
    key: "avatarFile" | "signatureFile",
    value: ImageUploaderValue,
  ) {
    if (value instanceof File) {
      data.append(key, value);
    }
  }

  function handleSubmit() {
    const data = new FormData();

    data.append("name", formValue.name.trim());
    data.append("lastname", formValue.lastname.trim());
    data.append("email", formValue.email.trim());
    data.append("phone", formValue.phone.trim());

    if (typeof formValue.avatar === "string" && formValue.avatar.trim()) {
      data.append("avatarUrl", formValue.avatar.trim());
    }

    if (password.trim()) {
      data.append("password", password.trim());
    }

    appendImageValueToFormData(data, "avatarFile", formValue.avatar);
    appendImageValueToFormData(data, "signatureFile", formValue.signature);

    startTransition(() => {
      formAction(data);
    });
  }

  return (
    <div className="mt-7">
      <ProfileEditView
        value={formValue}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
        onCancel={() => router.push(cancelPath)}
        title="Editar perfil"
        subtitle="Actualiza la información visible del usuario, su foto y su firma para documentos internos."
        extraHeaderContent={
          <div className="max-w-lg rounded-2xl border border-white/10 bg-white/5 p-4">
            <label
              htmlFor="profile-password"
              className="block text-sm font-semibold text-white"
            >
              Nueva contraseña (opcional)
            </label>
            <input
              id="profile-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Dejar vacío para no cambiar"
              className="mt-2 h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-slate-300 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200/40"
            />
            {state.errors?.password?.length ? (
              <p className="mt-2 text-xs text-rose-200">
                {state.errors.password[0]}
              </p>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
