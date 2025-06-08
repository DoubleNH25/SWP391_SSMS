export interface ApiRequestConfig<D = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers?: Record<string, string>;
  data?: D;
  baseURL?: string;
  requiresToken?: boolean;
  contentType?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}