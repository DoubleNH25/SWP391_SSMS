import { ApiRequestConfig, ApiResponse } from '@/types/ApiModel';
import axios, { AxiosResponse } from 'axios';

function getToken(){
  return localStorage.getItem('token');
}

async function ApiClient<T, D = unknown>({
  method,
  endpoint,
  data,
  headers = {},
  baseURL = 'https://localhost:7172/api',// https://localhost:7172/api  https://systemmms.ddns.net:5000/api
  requiresToken = true,
  contentType = 'application/json',
}: ApiRequestConfig<D>): Promise<ApiResponse<T>> {
  try {
    const token = requiresToken ? getToken() : null;
    const defaultHeaders: Record<string, string> = {
      'Content-Type': contentType,
      Accept: '*/*',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };
    const response: AxiosResponse<T> = await axios({
      method,
      url: endpoint,
      baseURL,
      data,
      headers: defaultHeaders,
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`API Error: ${message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}

export default ApiClient;