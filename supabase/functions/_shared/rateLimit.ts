/**
 * Simple in-memory rate limiting for Deno edge functions.
 * For production, consider Upstash Redis or similar.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

/** Check if a request should be rate limited. */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count < limit) {
    entry.count++
    return true
  }

  return false
}

/** Get client IP from request headers (Vercel, Supabase, or direct). */
export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-client-ip') ||
    'unknown'
  )
}
