"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DelegationType } from "@/app/lib/definitions";
import { FormSelect } from "./form-fields";

export function SearchPharmacieSupplies({
  pharmacyId,
  delegations,
}: {
  pharmacyId: string;
  delegations: DelegationType[];
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const customSelectedDelegations = delegations.map(
    ({ id, name, pharmacy }) => ({
      id,
      value: pharmacy.id,
      label: name,
    })
  );

  const handleSearch = (name: string, pharmacyId: string) => {
    const params = new URLSearchParams(searchParams);

    if (pharmacyId) {
      params.set("pharmacy", pharmacyId);
    } else {
      params.delete("pharmacy");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-1/2">
      <FormSelect
        key={pharmacyId}
        name="pharmacy"
        options={[
          {
            id: 0,
            value: "",
            label: "Seleccione la Delegación",
          },
          ...customSelectedDelegations,
        ]}
        defaultValue={pharmacyId}
        handleOption={handleSearch}
      />
    </div>
  );
}
