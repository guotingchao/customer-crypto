import { AxiosRequestConfig, AxiosResponse } from "axios";
import { encrypt, decrypt } from "@/hooks/useCrypto";

const aesSecret = "mW5fW7iY6tP0hZ3yA3vU7rG1eU2qZ1tY"; // 替换为实际的AES密钥
const jwtSecret = "8WaeNYzS6EfE03QH"; // 替换为实际的JWT密钥

export interface ApiResponse<T = any> extends AxiosResponse {
  code: number;
  message: string;
  data: T;
  success: boolean;
}
export enum StatusCode {
  OK = 1,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const interceptorsByRequest = async (
  config: AxiosRequestConfig & Record<string, any>,
  tokenKey?: string
) => {
  if (!config.metadata) {
    config.metadata = {}; // 创建 metadata 对象，如果不存在
  }

  if (!config.headers || !config.headers["Content-Type"]) {
    config.headers = {};
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
  }

  try {
    // NOTE:  加密请求数据
    config.data = {
      d: encrypt(config.data, aesSecret, jwtSecret),
    };
  } catch (error) {
    // @ts-ignore
    switch (error?.name) {
      case "NotFoundError":
        break;
      case "ExpiredError":
        // TODO
        break;
    }
  }

  config.timeout = 60 * 1000;

  return config;
};

const interceptorsByResponse = async (
  response: Promise<ApiResponse> & any
): Promise<ApiResponse> => {
  //NOTE - 进行解密
  try {
    if (response && response.status === 200 && response.data.r) {
      console.log("response.data.r", response.data.r);
      response.data = decrypt(response.data.r, aesSecret, jwtSecret);
    }
  } catch (error) {
    // 处理解密错误
    console.error("解密响应数据时出错:", error);
  }

  return response;
};

const responseError = (err: any) => {
  if (err && err.response) {
    const message = err.response?.data.message;
    switch (err.response.status) {
      case StatusCode.BAD_REQUEST:
      case StatusCode.FORBIDDEN:
        err.message = message;
        break;
      case StatusCode.UNAUTHORIZED:
        err.message = message;
        break;
      case StatusCode.NOT_FOUND:
        err.message = message || "Request error, the resource was not found";
        break;
      case 405:
        err.message = message || "Request method not allowed";
        break;
      case 408:
        err.message = message || "request timeout";
        break;
      case 429:
        err.message = message || "Too Many Attempts.";
        break;
      case StatusCode.INTERNAL_SERVER_ERROR:
        err.message = message || "Service Unavailable, please try later.";
        break;
      case 501:
        err.message = message || "Network not implemented";
        break;
      case 502:
        err.message = message || "network error";
        break;
      case 503:
        err.message = message || "Service Unavailable";
        break;
      case 504:
        err.message = message || "Network Timeout";
        break;
      case 505:
        err.message =
          message || "The request is not supported by the HTTP version";
        break;
      default:
        err.message = message || `Connection Error ${err.response.status}`;
    }
  } else {
    err.message = "Failed to connect to the server";
  }
  // err.message && Toast.fail(err.message)
  return Promise.reject(err);
};

const interceptorsByCardbrotherResponse = (
  response: any
): AxiosResponse<ApiResponse> | Promise<ApiResponse> => {
  interceptorsByResponse(response);
  const apiResponse: ApiResponse = response.data; // 任意类型的 data
  if (apiResponse && apiResponse.code === StatusCode.OK) {
    return apiResponse;
  }

  if (apiResponse instanceof Blob) {
    return response;
  }
  return Promise.reject(apiResponse);
};

export {
  interceptorsByRequest,
  interceptorsByResponse,
  responseError,
  interceptorsByCardbrotherResponse,
};
