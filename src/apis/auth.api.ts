import axios from "axios";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(
    "/api/auth/register",
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await axios.post(
    "/api/auth/login",
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

