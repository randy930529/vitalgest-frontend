"use server";

import {
  CheckListAmbulanceType,
  ChecklistSuppliesType,
  GuardType,
  ShiftType,
  SignatureType,
  StateType,
} from "@/app/lib/definitions";

export type UserState = StateType<{
  name?: string[];
  lastname?: string[];
  email?: string[];
  phone?: string[];
  avatarUrl?: string[];
  signatureFile?: string[];
  password?: string[];
  role?: string[];
  status?: string[];
  position?: string[];
  delegation?: string[];
  success?: string[];
}>;

export type UploadSignatureState = StateType<{
  mime?: string[];
  ext?: string[];
  size?: string[];
  success?: string[];
  key?: string[];
}> & {
  signature?: SignatureType;
};

export type DelegationState = StateType<{
  state?: string[];
  municipality?: string[];
  success?: string[];
}>;

export type AmbulanceState = StateType<{
  number?: string[];
  brand?: string[];
  model?: string[];
  delegationId?: string[];
  success?: string[];
}>;

export type ChecklistState = StateType<{
  ambulance?: string[];
  shift?: string[];
  km?: string[];
  notes?: string[];
  gasFile?: string[];
  signOperatorFile?: string[];
  signRecipientFile?: string[];
  recipientId?: string[];
  success?: string[];
}> & {
  checklist?: CheckListAmbulanceType;
};

export type ChecklistSuppliesState = StateType<{
  shiftId?: string[];
  success?: string[];
}> & {
  checklist?: ChecklistSuppliesType;
};

export type ChecklistAnswersState = StateType<{
  answers?: string[];
  success?: string[];
}>;

export type GuardState = StateType<{
  guardChief?: string[];
  date?: string[];
  ambulance?: string[];
  delegationId?: string[];
  state?: string[];
  success?: string[];
}> & {
  guard?: GuardType;
};

export type ShiftState = StateType<{
  ambulanceId?: string[];
  guardId?: string[];
  paramedicalId?: string[];
  driverId?: string[];
  success?: string[];
}> & {
  shift?: ShiftType;
};

export type SupplyPharmacyState = StateType<{
  pharmacy?: string[];
  category?: string[];
  specification?: string[];
  avaibleQuantity?: string[];
  expirationDate?: string[];
  measurementUnit?: string[];
  notes?: string[];
  success?: string[];
}>;

export type SupplyAmbulanceState = StateType<{
  ambulanceId?: string[];
  avaibleQuantity?: string[];
  minQuantity?: string[];
  areaId?: string[];
  supplyId?: string[];
  success?: string[];
}>;
