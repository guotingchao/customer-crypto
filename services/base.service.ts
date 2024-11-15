import {
  ApiResponse,
  interceptorsByCardbrotherResponse,
  interceptorsByRequest,
  responseError,
} from "@/utils/requet.interceptor";
import axios, { InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "http://115.159.132.203";
const fetch = axios.create({
  baseURL: BASE_URL,
  timeout: 15 * 1000,
});

fetch.interceptors.request.use(
  (config) => {
    const configs = interceptorsByRequest(
      config
    ) as unknown as InternalAxiosRequestConfig;
    return configs;
  },
  (error) => {
    return Promise.reject(error);
  }
);

fetch.interceptors.response.use(
  (response) => interceptorsByCardbrotherResponse(response),
  (err) => responseError(err)
);

const request = {
  get: async (url: string, params?: any): Promise<ApiResponse | any> => {
    return await fetch.get(url, { params });
  },
  post: async (url: string, params?: any) => fetch.post(url, params),
  postFormData: (url: string, params?: any) =>
    fetch.post(url, params, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (url: string, params?: any) => fetch.delete(url, { params }),
};

export const cryptoTestRequest = async (data: any) => {
  console.log("🐛🐛🐛 ------------------------🐛🐛🐛");
  const response = await request.post("/api/home/test", data);

  console.debug("🐛🐛🐛 ----------------------------------🐛🐛🐛");
  console.debug("🐛🐛🐛 ::: response:::", response);
  console.debug("🐛🐛🐛 ----------------------------------🐛🐛🐛");
  return response;
};
