"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AmbulanceType, DelegationType } from "@/app/lib/definitions";
import { FormSelect } from "@/app/ui/dashboard/form-fields";

export default function Search({
  placeholder = "Buscar",
}: {
  placeholder?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
      </div>
      <input
        type="text"
        id="simple-search"
        className="block w-full rounded-xl border border-slate-300 bg-white p-2 pl-10 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        required
      />
    </div>
  );
}

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
    }),
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
