export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  state: boolean;
};

export type ResponseAPI = {
  success: boolean;
  data: User | User[];
};
