"use client";

import { PaginationChecklist } from "@/app/ui/dashboard/pagination";

export default function NotesSignatureForm({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}) {
  return (
    <form className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4">
      <div className="p-4 md:col-span-1 md:row-span-1">{children}</div>

      <div className="flex flex-col gap-2 p-4 md:col-span-3 md:row-span-1">
        <h2 className="relative left-4 -top-4 w-[90%] text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
          {title}
          {/* TODO: agregarr el icono */}
        </h2>
        {/* //TODO: campos de formulario */}
      </div>

      <div className="md:p-4 md:col-span-4 md:row-span-1">
        <PaginationChecklist isLast />
      </div>
    </form>
  );
}
