"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AmbulanceType, DelegationType } from "@/app/lib/definitions";
import { FormSelect } from "@/app/ui/dashboard/form-fields";

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

export function SearchAmbulanceSupplies({
  ambulanceId,
  ambulances,
  delegations,
}: {
  ambulanceId: string;
  ambulances: AmbulanceType[];
  delegations: DelegationType[];
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const customSelectedAmbulances = ambulances.map(({ id, number }) => ({
    id,
    value: id,
    label: number,
  }));

  const handleSearch = (name: string, ambulanceId: string) => {
    const params = new URLSearchParams(searchParams);

    if (ambulanceId) {
      params.set("ambulance", ambulanceId);

      const delegationId =
        ambulances.find(({ id }) => id === params.get("ambulance"))?.delegation
          .id || "";
      const pharmacyId =
        delegations.find(({ id }) => id === delegationId)?.pharmacy.id || "";
      params.set("pharmacy", pharmacyId);
    } else {
      params.delete("ambulance");
      params.delete("pharmacy");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-1/2">
      <FormSelect
        key={ambulanceId}
        name="pharmacy"
        options={[
          {
            id: 0,
            value: "",
            label: "Seleccione la Ambulancia",
          },
          ...customSelectedAmbulances,
        ]}
        defaultValue={ambulanceId}
        handleOption={handleSearch}
      />
    </div>
  );
}
