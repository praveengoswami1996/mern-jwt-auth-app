import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from "axios";

const options: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

// Creating the main axios client for the app
const API: AxiosInstance = axios.create(options);

// A response interceptor is like a filter that automatically runs after a response is received from the server, letting you process, transform, log, or handle errors globally.

API.interceptors.response.use(
  // Will be called on success
  (response: AxiosResponse) => response.data,

  // Will be called on error
  (error: AxiosError) => {
    if(error.response) {
      const { status, data } = error.response;
      return Promise.reject({ status, ...(data as object) });
    }
    return Promise.reject({
      status: 0,
      message: "Network error or no response from server",
    });
  }
);

export default API;
