/**
 * Application constants
 */

export const TOKEN_EXPIRY_DAYS = 1;
export const INITIAL_RESET_VERSION = 1;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PHISHING_STATUS = {
  CREATED: 'created',
  CLICKED: 'clicked',
} as const;

