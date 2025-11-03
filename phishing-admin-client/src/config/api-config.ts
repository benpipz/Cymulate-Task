/**
 * API Configuration
 * Can be overridden via environment variables
 */

export const API_CONFIG = {
  SIMULATOR_API_URL:
    import.meta.env.VITE_SIMULATOR_API_URL || 'http://localhost:3000/v1',
  MANAGEMENT_API_URL:
    import.meta.env.VITE_MANAGEMENT_API_URL || 'http://localhost:3001/v1',
  REQUEST_TIMEOUT: 10000, // 10 seconds
} as const;

