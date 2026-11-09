export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
  timestamp: string;
}

