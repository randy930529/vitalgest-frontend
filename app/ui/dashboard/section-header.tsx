"use client";

import { useSelectedLayoutSegment } from "next/navigation";

const customSectionMeta: {
  [key: string]: { title: string; subtitle: string };
} = {
  null: { title: "Dashboard", subtitle: "Resumen general" },
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
};

export default function SectionHeader() {
  const segment = useSelectedLayoutSegment() || "null";
  const { title, subtitle } = customSectionMeta[segment] || {};

  return (
    <div className="text-center md:text-left">
      <h1 className="text-xl md:text-2xl font-bold dark:text-white">
        {title && title}
      </h1>
      <p className="font-semibold text-gray-500 dark:text-gray-400 md:ms-2">
        {subtitle && subtitle}
      </p>
    </div>
  );
}
