import crypto from 'crypto';

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Validate bearer token from Authorization header or query parameter
 */
export function validateToken(
  authHeader: string | undefined,
  queryToken: string | undefined,
  expectedToken: string
): boolean {
  // Check Authorization header first
  if (authHeader) {
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (bearerMatch) {
      return constantTimeCompare(bearerMatch[1] || '', expectedToken);
    }
  }
  
  // Check query parameter as fallback
  if (queryToken) {
    return constantTimeCompare(queryToken, expectedToken);
  }
  
  return false;
}

/**
 * Generate a unique ID for analysis results
 */
export function generateAnalysisId(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Sanitize string for safe display (basic HTML escaping)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
