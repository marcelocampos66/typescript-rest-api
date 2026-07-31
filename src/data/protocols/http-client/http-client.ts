export type HttpClientRequestConfig = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
};

export type HttpClientResponse<T = unknown> = {
  statusCode: number;
  body: T;
};

export interface HttpClient {
  get<T = unknown>(url: string, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>>;

  post<T = unknown>(url: string, body?: unknown, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>>;

  put<T = unknown>(url: string, body?: unknown, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>>;

  patch<T = unknown>(url: string, body?: unknown, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>>;

  delete<T = unknown>(url: string, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>>;
}
