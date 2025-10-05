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
  state?: boolean;
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
