import * as crypto from 'crypto';

export function generateEmailDateHashBase64(
  email: string,
  date: Date = new Date(),
): string {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const input = `${email.toLowerCase().trim()}|${dateStr}`;

  const base64Hash = crypto.createHash('sha256').update(input).digest('base64');

  return base64Hash.replace(/\+/g, '-').replace(/\//g, '_').substring(0, 6);
}

/**
 * Generates a one-time use token that includes the hashcode and resetVersion
 * @param hashcode - The base hashcode for the phishing target
 * @param resetVersion - The version number to track one-time use
 * @returns A base64-encoded token containing hashcode and resetVersion
 */
export function generatePhishingToken(
  hashcode: string,
  resetVersion: number,
): string {
  const tokenData = `${hashcode}|${resetVersion}`;
  const base64Token = Buffer.from(tokenData).toString('base64');
  // Make URL-safe
  return base64Token.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

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
