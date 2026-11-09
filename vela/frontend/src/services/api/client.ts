import { Platform } from 'react-native';

export interface RequestConfig extends RequestInit {
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    // Configured for local PostgreSQL backend or cloud REST endpoint
    const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || `http://${host}:5000/api`;
  }

  public setToken(token: string | null) {
    this.authToken = token;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Dispatches fetch with automatic timeout, headers, and error capture.
   */
  public async request<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const { timeoutMs = 2500, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  public get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: any, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

