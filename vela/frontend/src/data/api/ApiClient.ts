import { Platform } from 'react-native';
import { ApiResponse } from '@vela/shared';

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(customBaseUrl?: string) {
    if (customBaseUrl) {
      this.baseUrl = customBaseUrl;
    } else if (process.env.EXPO_PUBLIC_API_URL) {
      this.baseUrl = process.env.EXPO_PUBLIC_API_URL;
    } else {
      // Auto-detect localhost vs Android emulator localhost
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      this.baseUrl = `http://${host}:5000/api`;
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (options.requiresAuth !== false && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let payload: ApiResponse<T>;
    try {
      payload = await response.json();
    } catch {
      throw new Error(`Server returned HTTP ${response.status} with non-JSON response.`);
    }

    if (!response.ok || !payload.success) {
      const message =
        payload.error?.message ||
        payload.error?.details?.map(d => d.message).join(', ') ||
        `HTTP Error ${response.status}`;
      throw new Error(message);
    }

    return payload.data as T;
  }

  public async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

