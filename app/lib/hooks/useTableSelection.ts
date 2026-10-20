"use client";

import { Dispatch, SetStateAction, useState } from "react";

type SelectableItem = {
  id: string;
};

type TableSelection<T extends SelectableItem> = {
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  allSelected: boolean;
  handleCheckboxChange: (id: string, checked: boolean) => void;
  handleSelectAllChange: (checked: boolean) => void;
};

export function useTableSelection<T extends SelectableItem>(
  items: T[],
): TableSelection<T> {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemIds = items.map(({ id }) => id);
  const allSelected =
    itemIds.length > 0 && itemIds.every((id) => selectedIds.includes(id));

  function handleCheckboxChange(id: string, checked: boolean) {
    setSelectedIds((currentIds) => {
      if (checked) {
        return currentIds.includes(id) ? currentIds : [...currentIds, id];
      }

      return currentIds.filter((selectedId) => selectedId !== id);
    });
  }

  function handleSelectAllChange(checked: boolean) {
    setSelectedIds(checked ? itemIds : []);
  }

  return {
    selectedIds,
    setSelectedIds,
    allSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  };
}
