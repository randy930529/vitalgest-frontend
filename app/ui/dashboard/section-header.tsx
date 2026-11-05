"use client";

import { useSelectedLayoutSegments } from "next/navigation";

const customSectionMeta: {
  [key: string]: { title: string; subtitle: string };
} = {
  null: {
    title: "Centro Operativo Digital",
    subtitle: "Cruz Roja Mexicana",
  },
  dashboard: {
    title: "Panel Administrativo",
    subtitle: "Resumen general operativo",
  },
  users: {
    title: "Gestión de Usuarios del Sistema",
    subtitle: "Administrar usuarios que tienen acceso al sistema",
  },
  delegations: {
    title: "Gestión de Delegaciones",
    subtitle: "Administrar delegaciones en el sistema",
  },
  guards: {
    title: "Gestión de Guardias",
    subtitle: "Administrar guardias en el sistema",
  },
  ambulances: {
    title: "Gestión de Ambulancias",
    subtitle: "Administrar ambulancias en el sistema",
  },
  supplies: {
    title: "Gestión de Insumos",
    subtitle: "Administrar los insumos en el sistema",
  },
  questions: {
    title: "Gestión de Preguntas",
    subtitle: "Administrar las preguntas de checklist en el sistema",
  },
  orders: {
    title: "Gestión de Pedidos",
    subtitle: "Administrar los pedidos en el sistema",
  },
  profile: {
    title: "Edición de Perfil",
    subtitle: "Actualiza la información del usuario",
  },
} as const;

function getSectionMeta(segments: string[]) {
  const dashboardIndex = segments.indexOf("dashboard");
  const profileIndex = segments.indexOf("profile");
  const segment =
    dashboardIndex === -1
      ? profileIndex === -1
        ? "null"
        : "profile"
      : segments[dashboardIndex + 1] || "dashboard";

  return customSectionMeta[segment] || {};
}

export default function SectionHeader() {
  const { title, subtitle } = getSectionMeta(useSelectedLayoutSegments());

  return (
    <div className="text-center md:text-left">
      <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title && title}
      </h1>
      <p className="mt-1 text-sm font-medium text-slate-300 md:ms-0">
        {subtitle && subtitle}
      </p>
    </div>
  );
}

export function SectionHeaderOverride({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center md:text-left">
      <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-sm font-medium text-slate-300 md:ms-0">
        {subtitle}
      </p>
    </div>
  );
}
