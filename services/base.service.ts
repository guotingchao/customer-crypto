import {
  ApiResponse,
  interceptorsByRequest,
  interceptorsByResponse,
  responseError,
} from "@/utils/requet.interceptor";

import { create } from "apisauce";
import { InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "http://115.159.132.203";
const api = create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
});

api.axiosInstance.interceptors.request.use(
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

api.axiosInstance.interceptors.response.use(
  async (response) => await interceptorsByResponse(response),
  (err) => responseError(err)
);

const request = {
  get: async (url: string, params?: any): Promise<ApiResponse | any> => {
    return await api.get(url, { params });
  },
  post: async (url: string, params?: any) => api.post(url, params),
  postFormData: (url: string, params?: any) =>
    api.post(url, params, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (url: string, params?: any) => api.delete(url, { params }),
};

export const cryptoTestRequest = async (payload: any) => {
  const response = await request.post("/api/home/test", payload);

  console.debug("🐛🐛🐛 ----------------------------------🐛🐛🐛");
  console.debug("🐛🐛🐛 ::: response:::", response.data);
  console.debug("🐛🐛🐛 ----------------------------------🐛🐛🐛");

  return response.data;
};
