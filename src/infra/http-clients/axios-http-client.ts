import axios, { AxiosError, AxiosInstance } from 'axios';
import { injectable } from '../../core/dependency-injection';
import { HttpClient, HttpClientRequestConfig, HttpClientResponse } from '../../data/protocols/http-client';
import { ExternalApiError } from '../../core/errors';
import { HttpStatusCode } from '../../core/helpers/http';
import { HTTP_CLIENT_TIMEOUT } from '../../application/config/env';
import logger from '../../application/config/logger';

type RequestOptions = HttpClientRequestConfig & {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  url: string;
  data?: unknown;
};

@injectable()
export class AxiosHttpClient implements HttpClient {
  private readonly instance: AxiosInstance = axios.create({ timeout: HTTP_CLIENT_TIMEOUT });

  async get<T = unknown>(url: string, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>> {
    return this.request<T>({ method: 'get', url, ...config });
  }

  async post<T = unknown>(url: string, body?: unknown, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>> {
    return this.request<T>({ method: 'post', url, data: body, ...config });
  }

  async put<T = unknown>(url: string, body?: unknown, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>> {
    return this.request<T>({ method: 'put', url, data: body, ...config });
  }

  async patch<T = unknown>(url: string, body?: unknown, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>> {
    return this.request<T>({ method: 'patch', url, data: body, ...config });
  }

  async delete<T = unknown>(url: string, config?: HttpClientRequestConfig): Promise<HttpClientResponse<T>> {
    return this.request<T>({ method: 'delete', url, ...config });
  }

  private async request<T>(options: RequestOptions): Promise<HttpClientResponse<T>> {
    const { method, url, data, headers, params, timeout } = options;

    try {
      const response = await this.instance.request<T>({ method, url, data, headers, params, timeout });

      return { statusCode: response.status, body: response.data };
    } catch (error) {
      throw this.handleError(error as AxiosError, url);
    }
  }

  private handleError(error: AxiosError, url: string): ExternalApiError {
    if (error.response) {
      logger.error(`External API call failed: ${url}`, { statusCode: error.response.status, data: error.response.data });

      return new ExternalApiError(`Request to ${url} failed with status ${error.response.status}`, error.response.status);
    }

    logger.error(`External API call errored: ${url}`, { error: error.message });

    return new ExternalApiError(`Request to ${url} failed: ${error.message}`, HttpStatusCode.SERVICE_UNAVAILABLE);
  }
}
