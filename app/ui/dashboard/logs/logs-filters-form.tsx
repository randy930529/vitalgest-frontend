"use client";

import { useMemo, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FunnelIcon } from "@heroicons/react/24/outline";
import {
  AuditLogCategoryType,
  AuditLogsFiltersType,
  StateType,
  UserType,
} from "@/app/lib/definitions";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";
import { GenericForm } from "@/app/ui/components/generic-form";
import { FormSelect } from "@/app/ui/dashboard/form-fields";

export default function LogsFiltersForm({
  filters,
  users,
  onClose,
}: {
  filters?: AuditLogsFiltersType;
  users: UserType[];
  onClose?: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const customUsers = [
    {
      id: "",
      value: "",
      label: "Todos",
    },
    ...users.map((user) => ({
      id: user.id,
      value: user.id,
      label: `${user.name} ${user.lastname}`,
    })),
  ];
  const fields = getFormConfigFields("logsFilters", [
    {
      type: "custom",
      name: "name",
      component: CustomFilters({ categories: filters?.categories ?? [] }),
    },

    {
      type: "select",
      name: "userId",
      title: "Usuario",
      defaultValue: searchParams.get("userId") ?? "",
      options: customUsers,
      required: true,
    },
    {
      type: "date",
      name: "from",
      title: "Desde",
      defaultValue: searchParams.get("from") ?? "",
    },
    {
      type: "date",
      name: "to",
      title: "Hasta",
      defaultValue: searchParams.get("to") ?? "",
    },
  ]);

  async function handleFilters(prevState: StateType<{}>, formData: FormData) {
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && value.trim()) params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`);
    onClose?.();

    return prevState;
  }

  function handleClearFilters() {
    router.replace(pathname);
    onClose?.();
  }

  return (
    <GenericForm
      fields={fields}
      onSubmit={handleFilters}
      initialState={{ errors: {}, message: null }}
      onCancel={handleClearFilters}
      submitText="Filtrar"
      submitIcon={<FunnelIcon className="w-4 h-4" />}
    />
  );
}

function CustomFilters({ categories }: { categories: AuditLogCategoryType[] }) {
  const searchParams = useSearchParams();
  const [entity, setEntity] = useState(searchParams.get("entity") ?? "");
  const [action, setAction] = useState(searchParams.get("action") ?? "");
  const selectedCategory = categories.find(
    (category) => category.entity === entity,
  );
  const actions = useMemo(
    () => selectedCategory?.actions ?? [],
    [selectedCategory],
  );

  function handleOption(name: string, value: string) {
    setEntity(value);
    setAction("");
  }

  return (
    <>
      <FormSelect
        key="entity"
        name="entity"
        title="Entidad"
        defaultValue={entity}
        options={[
          { id: 0, label: "Todas", value: "" },
          ...categories.map((category) => ({
            id: category.entity,
            label: category.entity,
            value: category.entity,
          })),
        ]}
        handleOption={handleOption}
        required
      />

      <FormSelect
        key="action"
        name="action"
        title="Acción"
        defaultValue={action}
        options={[
          { id: 0, label: "Todas", value: "" },
          ...actions.map((action) => ({
            id: action,
            label: action,
            value: action,
          })),
        ]}
        handleOption={(name, value) => setAction(value)}
        required
        disabled={!entity}
      />
    </>
  );
}
