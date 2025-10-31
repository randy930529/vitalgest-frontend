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
  delegation_id: string;
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
  pharmacyId: string;
};

export type GuardType = {
  id: string;
  guardChief: UserType;
  date: string;
  ambulance: string;
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
  date: string;
  vale_gas?: string;
  notas_adicionales?: string;
  state: "Nuevo" | "Abierto" | "Cerrado";
  guard: GuardType;
  preguntas: {
    pregunta: string;
    area_pregunta: string;
    order: number;
  };
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
  boolean_response: boolean;
  enum_response: boolean;
  free_response: boolean;
  createdAt: Date;
  updatedAt: Date;
};
