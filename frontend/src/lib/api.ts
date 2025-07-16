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

export const login = async (data: LoginData) => API.post("/auth/login", data);
export const register = async (data: RegisterFormData) => API.post("/auth/register", data);
export const verifyEmail = async (verificationCode: string) =>
  API.get(`/auth/email/verify/${verificationCode}`);
export const sendPasswordResetEmail = async (email: string) =>
  API.post("/auth/password/forgot", { email });