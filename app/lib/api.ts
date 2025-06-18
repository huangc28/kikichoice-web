// General API utilities for the entire application
// Shop-specific API functions have been moved to app/routes/shop/api.ts

// This file can be used for shared API utilities across different routes
export const API_HEADERS = {
  'Content-Type': 'application/json',
};

// Generic API error handler
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: API_HEADERS,
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}