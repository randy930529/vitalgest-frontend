import type { ReactNode } from "react";
import { UserIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { ProfileFormData } from "@/app/lib/definitions";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import { formatUserStatusLabel } from "@/app/lib/utils";
import { ImageUploader } from "@/app/ui/components/profile/ImageUploader";
import { FormButtons } from "@/app/ui/button";

type ProfileEditViewProps = {
  value: ProfileFormData;
  onFieldChange: <K extends keyof ProfileFormData>(
    field: K,
    nextValue: ProfileFormData[K],
  ) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  extraHeaderContent?: ReactNode;
  isSubmitting?: boolean;
};

type FieldProps = {
  label: string;
  name: "name" | "lastname" | "email" | "phone";
  value: string;
  placeholder: string;
  icon: ReactNode;
  onChange: (
    name: "name" | "lastname" | "email" | "phone",
    value: string,
  ) => void;
};

function TextField({
  label,
  name,
  value,
  placeholder,
  icon,
  onChange,
}: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 text-slate-400">
          {icon}
        </span>
        <input
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
        />
      </span>
    </label>
  );
}

function SummaryCard({
  title,
  value,
  tint,
}: {
  title: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.4)] backdrop-blur-sm">
      <div
        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: tint, color: "#0f172a" }}
      >
        {title}
      </div>
      <p className="mt-3 text-lg font-semibold leading-7 text-slate-900 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

export function ProfileEditView({
  value,
  onFieldChange,
  onSubmit,
  onCancel,
  title = "Editar perfil",
  subtitle = "Actualiza la informacion visible del usuario, su foto y la firma que se usara en documentos internos.",
  extraHeaderContent,
  isSubmitting,
}: ProfileEditViewProps) {
  const userPosition =
    value.position?.trim() || ROLE_MANAGER.getLabel(value.role);

  function handleTextFieldChange(
    name: "name" | "lastname" | "email" | "phone",
    nextValue: string,
  ) {
    onFieldChange(name, nextValue as ProfileFormData[typeof name]);
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(254,226,226,0.65),_rgba(248,250,252,0.94)_30%,_#f8fafc_60%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="overflow-hidden rounded-[36px] bg-slate-950 text-white shadow-[0_35px_80px_-45px_rgba(15,23,42,0.8)]">
          <div className="relative isolate overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-indigo-700 to-blue-700" />
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-rose-500/20 blur-3xl" />
            <div className="absolute left-10 bottom-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-100">
                  VitalGest
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    {subtitle}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px] lg:max-w-[460px] lg:flex-1">
                <SummaryCard
                  title="Rol"
                  value={ROLE_MANAGER.getLabel(value.role)}
                  tint="rgba(167,139,250,0.30)"
                />
                <SummaryCard
                  title="Delegacion"
                  value={value.delegation || "Pendiente"}
                  tint="rgba(134,239,172,0.32)"
                />
                <SummaryCard
                  title="Estado"
                  value={formatUserStatusLabel(value.status)}
                  tint="rgba(251,191,36,0.28)"
                />
              </div>
            </div>
            {extraHeaderContent ? (
              <div className="relative mt-6">{extraHeaderContent}</div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
          <aside className="space-y-6 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-6">
            <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <ImageUploader
                label="Foto de perfil"
                hint="Imagen principal del usuario en el panel"
                value={value.avatar}
                aspect="square"
                emptyTitle="Sube una foto de perfil"
                emptyDescription="Arrastra una imagen o selecciona un archivo JPG, PNG o WEBP. Se recomienda formato cuadrado."
                buttonLabel="Seleccionar imagen"
                onChange={(file) =>
                  onFieldChange("avatar", file as ProfileFormData["avatar"])
                }
                meta={
                  <p className="text-xs text-slate-400">
                    Resolucion sugerida: 600 x 600 px
                  </p>
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[24px] border border-sky-100 bg-sky-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Cargo
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 [overflow-wrap:anywhere]">
                  {userPosition || "Cargo pendiente"}
                </p>
              </div>
              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Correo
                </p>
                <p className="mt-3 break-all text-sm font-medium text-slate-700">
                  {value.email || "Sin correo definido"}
                </p>
              </div>
              <div className="rounded-[24px] border border-amber-100 bg-amber-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Contacto
                </p>
                <p className="mt-3 text-sm font-medium text-slate-700 [overflow-wrap:anywhere]">
                  {value.phone || "Sin telefono definido"}
                </p>
              </div>
            </div>
          </aside>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit?.();
            }}
            className="space-y-6 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-6 lg:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6 rounded-[28px] border border-slate-100 bg-slate-50/60 p-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Informacion general
                  </h2>
                  <p className="text-sm text-slate-500">
                    Aqui puedes actualizar tu nombre y apellidos.
                  </p>
                </div>

                <div className="grid gap-4">
                  <TextField
                    label="Nombre"
                    name="name"
                    value={value.name}
                    placeholder="Ej. Juan"
                    icon={<UserIcon className="h-5 w-5" />}
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    label="Apellidos"
                    name="lastname"
                    value={value.lastname}
                    placeholder="Ej. Perez Lopez"
                    icon={<UserIcon className="h-5 w-5" />}
                    onChange={handleTextFieldChange}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-[28px] border border-slate-100 bg-slate-50/60 p-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Contacto
                  </h2>
                  <p className="text-sm text-slate-500">
                    Actualiza tus datos de contacto para que el equipo pueda
                    comunicarse contigo.
                  </p>
                </div>

                <div className="grid gap-4">
                  <TextField
                    label="Telefono"
                    name="phone"
                    value={value.phone}
                    placeholder="+52 341 000 0000"
                    icon={<PhoneIcon className="h-5 w-5" />}
                    onChange={handleTextFieldChange}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-slate-50/60 p-5">
              <ImageUploader
                label="Firma digital"
                hint="Imagen que se imprimira en formatos y validaciones internas"
                value={value.signature}
                aspect="wide"
                emptyTitle="Sube tu firma aquí"
                emptyDescription="Usa fondo transparente o blanco para obtener mejor resultado al incrustarla en documentos."
                buttonLabel="Seleccionar firma"
                onChange={(file) =>
                  onFieldChange(
                    "signature",
                    file as ProfileFormData["signature"],
                  )
                }
                meta={
                  <p className="text-xs text-slate-400">
                    Formato recomendado: PNG horizontal
                  </p>
                }
              />
            </div>

            <FormButtons
              onCancel={onCancel}
              submitText={"Guardar cambios"}
              isLoading={isSubmitting}
            />
          </form>
        </div>
      </div>
    </section>
  );
}
