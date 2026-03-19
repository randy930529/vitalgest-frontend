export type BaseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
};

export type UserType = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  role:
    | "admin"
    | "paramedical"
    | "vehicle_operator"
    | "head_guard"
    | "general_admin"
    | string;
  position: string;
  status?: boolean;
  delegationId: string;
  delegation: DelegationType;
};

export type ResponseAPIType<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export type StateType<T> = {
  errors?: T;
  message?: string | null;
};

export type SessionPayload = {
  user: UserType;
  expiresAt: Date;
  accessToken: string;
  refreshToken: string;
};

export type SessionType = {
  isAuth: boolean;
  user: UserType;
  accessToken: string;
  refreshToken: string;
};

export type MxState = {
  id: number;
  name: string;
  municipalities: {
    id: number;
    name: string;
  }[];
};

export type CustomOptions = {
  id: number | string;
  value: string;
  label: string;
};

export type CustomMxState = CustomOptions & {
  municipalities?: CustomOptions[];
};

export type FormInputType = {
  [key: string]: {
    type: string;
    title: string;
    required?: boolean;
    placeholder?: string;
  };
};

export type DelegationType = BaseType & {
  name: string;
  state: {
    id: number;
    name: string;
  };
  municipality: {
    id: number;
    name: string;
  };
  pharmacy: {
    id: string;
  };
};

export type GuardType = BaseType & {
  guardChief: UserType;
  date: string;
  state: "En curso" | "Nueva" | "Cerrada";
  delegation: DelegationType;
  shifts: ShiftType[];
};

export type AmbulanceType = BaseType & {
  id: string;
  number: string;
  brand: string;
  model: string;
  delegation: DelegationType;
};

export type AmbulanceAreaType = BaseType & {
  name: string;
  section: string;
  order: number;
};

export type CheckListAmbulanceType = BaseType & {
  ambulance_id: string;
  shift_id: string;
  time: string;
  km: number;
  gas_path?: string;
  sign_operator_path?: string;
  recipient_id?: string;
  sign_recipient_path?: string;
  notes?: string;
};

export type CheckListSupplyType = BaseType & {
  shift_id: string;
  sign_paramedical_path?: string;
  recipient_id: string;
  sign_recipient_path: string;
  notes: string;
  ambulance_id: string;
};

export type StepItemType = {
  id: number;
  label: string;
  details?: string;
  status?: "completed" | "pending" | "error";
};

export type TimelinePropsType = {
  steps: StepItemType[];
  currentStepId: number;
  showStatus?: boolean;
  progress?: number;
};

export type ChecklistQuestionsType = BaseType & {
  question: string;
  name_category: string;
  order_category: number;
  order_question_category: number;
  name_subcategory?: string;
  order_subcategory?: number;
  type_response:
    | "bool"
    | "option"
    | "text"
    | "bool_option"
    | "bool_text"
    | "option_text"
    | "bool_option_text";
};

export type ChecklistSuppliesType = BaseType & {
  shift_id: string;
  sign_paramedical_path?: string;
  sign_recipient_path?: string;
};

export type ChecklistAnswersType = {
  questionId: string;
  type: ChecklistQuestionsType["type_response"];
  valueBool?: boolean;
  valueOption?: string;
  valueText?: string;
};

export type ChecklistSupplyType = {
  supplyId: string;
  requiredQuantity: number;
};

export type ShiftType = BaseType & {
  name?: string;
  ambulance: AmbulanceType;
  guard: GuardType;
  paramedical: UserType;
  driver: UserType;
  checklistAmbulance?: CheckListAmbulanceType;
  checklistSupplies?: CheckListSupplyType;
};

export type SupplyPharmacyType = BaseType & {
  category: string;
  specification: string;
  avaible_quantity: number;
  expiration_date: string;
  measurement_unit: string;
  pharmacy_id: string;
};

export type SupplyAmbulanceType = BaseType & {
  category: string;
  specification: string;
  avaible_quantity: number;
  min_quantity: number;
  expiration_date: string;
  measurement_unit: string;
  area_id: number;
  ambulance_id: string;
};

export type FormFieldType =
  | {
      type: "text" | "email" | "password" | "number";
      name: string;
      title?: string;
      required?: boolean;
      placeholder?: string;
      defaultValue?: string;
    }
  | {
      type: "select";
      name: string;
      title?: string;
      required?: boolean;
      options: Array<{ id: string | number; value: string; label: string }>;
      defaultValue?: string;
    }
  | {
      type: "date";
      name: string;
      title?: string;
      required?: boolean;
      defaultValue?: string;
    }
  | {
      type: "textarea";
      name: string;
      title?: string;
      required?: boolean;
      rows?: number;
    }
  | { type: "checkbox"; name: string; title: string; defaultChecked?: boolean }
  | { type: "custom"; name: string; component: React.ReactNode };

export type VerifySignatureResult = {
  approved: boolean;
  signatureUrl?: string;
  error?: string;
};
