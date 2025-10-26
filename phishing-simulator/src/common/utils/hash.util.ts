import * as crypto from 'crypto';

export function generateMailDateHashBase64(
  email: string,
  date: Date = new Date(),
): string {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const input = `${email.toLowerCase().trim()}|${dateStr}`;

  const base64Hash = crypto.createHash('sha256').update(input).digest('base64');

  return base64Hash.replace(/\+/g, '-').replace(/\//g, '_').substring(0, 6);
}
