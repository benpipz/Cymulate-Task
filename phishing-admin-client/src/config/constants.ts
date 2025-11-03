// API endpoints are now in api-config.ts

export const QUERY_KEYS = {
  PHISHING_ATTEMPTS: 'phishing-attempts',
} as const;

export const REFETCH_INTERVALS = {
  ATTEMPTS_LIST: 5000, // 5 seconds
} as const;

export const STALE_TIME = {
  ATTEMPTS_LIST: 10000, // 10 seconds
} as const;

