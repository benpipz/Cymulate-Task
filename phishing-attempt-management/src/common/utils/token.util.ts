/**
 * Decodes a phishing token to extract hashcode and resetVersion
 * @param token - The base64-encoded token
 * @returns An object with hashcode and resetVersion, or null if invalid
 */
export function decodePhishingToken(token: string): {
  hashcode: string;
  resetVersion: number;
} | null {
  try {
    // Make URL-safe base64 valid again
    let base64Token = token.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64Token.length % 4) {
      base64Token += '=';
    }
    const decoded = Buffer.from(base64Token, 'base64').toString('utf-8');
    const [hashcode, resetVersionStr] = decoded.split('|');
    const resetVersion = parseInt(resetVersionStr, 10);

    if (!hashcode || isNaN(resetVersion)) {
      return null;
    }

    return { hashcode, resetVersion };
  } catch (error) {
    return null;
  }
}

