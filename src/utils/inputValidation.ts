// Basic input validation utilities

const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export function sanitizeTextInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';
  
  // Remove potentially dangerous characters
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
  
  return sanitized.slice(0, maxLength);
}

export function sanitizeArrayInput(
  input: string[], 
  maxItems: number = 20, 
  maxItemLength: number = 50
): string[] {
  if (!Array.isArray(input)) return [];
  
  return input
    .slice(0, maxItems)
    .map(item => sanitizeTextInput(item, maxItemLength))
    .filter(item => item.length > 0);
}

export function checkRateLimit(
  key: string, 
  maxAttempts: number, 
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now - record.timestamp > windowMs) {
    rateLimitStore.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
}