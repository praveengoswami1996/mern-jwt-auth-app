import axios from "axios";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};


// Creating the main axios client for the app 
const API = axios.create(options);

// A response interceptor is like a filter that automatically runs after a response is received from the server, letting you process, transform, log, or handle errors globally.
API.interceptors.response.use(
  // Will be called on success
  (response) => response.data,

  // Will be called on error
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data })
  }
)


export default API;
