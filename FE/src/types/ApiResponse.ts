interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiRequestConfig<D = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: D;
  headers?: Record<string, string>;
  baseURL?: string;
  requiresToken?: boolean;
  contentType?: string;
}