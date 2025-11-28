"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export default function ChecklistSubTitle() {
  const segment = useSelectedLayoutSegment();
  const subtitle = {
    ambulances: "Checklist de Ambulancia",
    supplies: "Checklist de Insumos",
    get(key: string | null): string {
      if (!key) return "";
      if (key === "ambulances") return this.ambulances;
      if (key === "supplies") return this.supplies;
      return "";
    },
  };

  return (
    <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center">
      {subtitle.get(segment)}
    </p>
  );
}
