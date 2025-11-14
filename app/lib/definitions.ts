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

export type DelegationType = {
  id: string;
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
    id: number;
  };
  createdAt: string;
};

export type GuardType = {
  id: string;
  guardChief: UserType;
  date: string;
  state: "En curso" | "Nueva" | "Cerrada";
  delegation: DelegationType;
  createdAt: string;
};

export type AmbulanceType = {
  id: string;
  number: string;
  brand: string;
  model: string;
  delegation: DelegationType;
};

export type CheckListAmbulanceType = {
  id: string;
  ambulance_id: string;
  shift_id: string;
  time: string;
  km: number;
  gas_path: string;
  createdAt: string;
  updatedAt: string;
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

export type ChecklistQuestionsType = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type ShiftType = {
  id: string;
  name?: string;
  ambulance: AmbulanceType;
  guard: GuardType;
  paramedical: UserType;
  driver: UserType;
  createdAt: string;
  updatedAt: string;
};

export type SupplyType = {
  id: string;
  category: string;
  specification: string;
  avaible_quantity: number;
  expiration_date: string;
  measurement_unit: string;
  pharmacy_id: string;
  createdAt: string;
  updatedAt: string;
};
