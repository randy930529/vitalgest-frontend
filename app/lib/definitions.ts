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
  // position: 'developer',
  state?: boolean;
};

export type DataType = UserType | UserType[];

export type ResponseAPIType = {
  success: boolean;
  data: DataType;
};

export type StateType<T> = {
  errors?: T;
  message?: string | null;
};
