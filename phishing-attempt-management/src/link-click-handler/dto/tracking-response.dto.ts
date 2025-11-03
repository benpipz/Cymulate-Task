/**
 * Response DTO for tracking endpoint
 * Returned when token is expired or already used
 */
export class TrackingResponseDto {
  /**
   * Status indicating the token is expired
   * @example 'expired'
   */
  status: 'expired';
}

