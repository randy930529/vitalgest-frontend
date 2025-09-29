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

export type DelegationType = {
  id: string;
  name: string;
  stateId: number;
  municipalityId: number;
  pharmacyId: string;
};

export type GuardType = {
  id: string;
  guardChief: string;
  date: string;
  ambulance: string;
  state: string;
  createdAt: string;
};
