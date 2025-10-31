"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FormSignature, FormTextarea } from "@/app/ui/dashboard/form-fields";
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
          <span className="inline-block align-middle ms-2">
            <InformationCircleIcon className="w-5 h-5 bg-sky-950 text-white font-extrabold rounded-full" />
          </span>
        </h2>

        <FormTextarea key="write-notes" name="notes" rows={10} />

        <div className="flex gap-4 md:gap-20">
          <div className="w-1/2 md:p-4">
            <FormSignature
              key="write-out-signature"
              name="write-out-signature"
              title="Entrega:"
              usersOptions={[
                // TOTEST: Data Test
                {
                  id: "uuid-1",
                  value: "uuid-1",
                  label: "User1",
                  position: "Dev",
                },
                {
                  id: "uuid-2",
                  value: "uuid-2",
                  label: "User2",
                  position: "Test",
                },
              ]}
            />
          </div>

          <div className="w-1/2 md:p-4">
            <FormSignature
              key="write-in-signature"
              name="write-in-signature"
              title="Recibe:"
              usersOptions={[]}
            />
          </div>
        </div>
      </div>

      <div className="md:p-4 md:col-span-4 md:row-span-1">
        <PaginationChecklist isLast />
      </div>
    </form>
  );
}
