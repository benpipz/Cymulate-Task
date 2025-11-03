import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.message) {
      return apiError.message;
    }
    if (typeof apiError === 'string') {
      return apiError;
    }
    return error.message || 'An unexpected error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function showErrorToast(message: string): void {
  // Simple alert for now - can be replaced with toast library later
  alert(`Error: ${message}`);
}

export function showSuccessToast(message: string): void {
  // Simple alert for now - can be replaced with toast library later
  alert(message);
}

