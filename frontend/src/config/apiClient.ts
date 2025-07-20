import { UNAUTHORIZED } from "@/constants/http";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from "axios";
import queryClient from "./queryClient";
import { navigate } from "@/lib/navigation";

interface ErrorResponseData {
  status: number;
  message?: string;
  errorCode?: string;
}

const options: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

// create a separate client for refreshing the access token
// to avoid infinite loops with the error interceptor
const TokenRefreshClient: AxiosInstance = axios.create(options);
TokenRefreshClient.interceptors.response.use((response: AxiosResponse) => response.data);

// Creating the main axios client for the app
const API: AxiosInstance = axios.create(options);

// A response interceptor is like a filter that automatically runs after a response is received from the server, letting you process, transform, log, or handle errors globally.

API.interceptors.response.use(
  // Will be called on success
  (response: AxiosResponse) => response.data,

  // Will be called on error
  async (error: AxiosError<ErrorResponseData>) => {
    console.log("Bhai Control Refresh mein bhi aaya hai");
    if(error.response && error.config) {
      const { status, data } = error.response;

      // Try to refresh the access token behind the scenes
      if(status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
        try {
          // Refresh the access token and then retry the original request
          await TokenRefreshClient.get("/auth/refresh");
          return TokenRefreshClient(error.config)
        } catch {
          // if there was an error in refreshing the accessToken then handle refresh errors by clearing the query cache & redirecting to login
          queryClient.clear();
          navigate("/login", {
            state: {
              redirectUrl: window.location.pathname
            }
          })
        }
      }

      return Promise.reject({ status, ...(data as object) });
    }
    return Promise.reject({
      status: 0,
      message: "Network error or no response from server",
    });
  }
);

export default API;
