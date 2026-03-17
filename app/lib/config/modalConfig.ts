import dynamic from "next/dynamic";
import { ModalFormSkeleton } from "@/app/ui/dashboard/skeletons";

export const modalComponents = {
  guardForm: dynamic(
    () => import("@/app/ui/dashboard/guards/create/guard-form"),
    {
      ssr: false,
      loading: () => ModalFormSkeleton({ fields: 2, columns: 1 }),
    },
  ),
  ambulanceForm: dynamic(
    () => import("@/app/ui/dashboard/ambulances/create/ambulance-form"),
    {
      ssr: false,
      loading: () => ModalFormSkeleton({ fields: 4, columns: 2 }),
    },
  ),
  userForm: dynamic(() => import("@/app/ui/dashboard/users/create/user-form"), {
    ssr: false,
    loading: () => ModalFormSkeleton({ fields: 6, columns: 2 }),
  }),
  delegationForm: dynamic(
    () => import("@/app/ui/dashboard/delegations/create/delegation-form"),
    {
      ssr: false,
      loading: () => ModalFormSkeleton({ fields: 2, columns: 2 }),
    },
  ),
  supplyPharmacyForm: dynamic(
    () => import("@/app/ui/dashboard/supplies/pharmacies/create/supply-form"),
    {
      ssr: false,
      loading: () => ModalFormSkeleton({ fields: 6, columns: 2 }),
    },
  ),
  supplyAmbulanceForm: dynamic(
    () => import("@/app/ui/dashboard/supplies/ambulances/create/supply-form"),
    {
      ssr: false,
      loading: () => ModalFormSkeleton({ fields: 6, columns: 2 }),
    },
  ),
};
