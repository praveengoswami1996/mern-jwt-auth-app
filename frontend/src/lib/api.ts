import API from "@/config/apiClient";

type LoginData = {
    email: string;
    password: string;
}
type RegisterFormData = {
    email: string;
    password: string;
    confirmPassword: string;
}

type ResetPasswordFormData = {
  verificationCode: string;
  password: string;
}

export const register = async (data: RegisterFormData) => API.post("/auth/register", data);

export const verifyEmail = async (verificationCode: string) =>
  API.get(`/auth/email/verify/${verificationCode}`);

export const login = async (data: LoginData) => API.post("/auth/login", data);
export const logout = async () => API.get("/auth/logout");

export const sendPasswordResetEmail = async (email: string) =>
  API.post("/auth/password/forgot", { email });

export const resetPassword = async ({ verificationCode, password }: ResetPasswordFormData) =>
  API.post("/auth/password/reset", { verificationCode, password });

export const getUser = async () => API.get("/user");