import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitStore>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Rate limiter middleware
 * @param config Rate limit configuration
 * @returns Middleware function
 */
export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse | Response>
  ): Promise<NextResponse | Response> {
    const identifier = getIdentifier(request)
    const now = Date.now()

    let clientData = rateLimitStore.get(identifier)

    // Initialize or reset if window expired
    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 0,
        resetTime: now + config.interval,
      }
    }

    clientData.count++
    rateLimitStore.set(identifier, clientData)

    // Check if rate limit exceeded
    if (clientData.count > config.uniqueTokenPerInterval) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000)

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter,
          message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(config.uniqueTokenPerInterval),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(clientData.resetTime),
          },
        }
      )
    }

    // Add rate limit headers to response
    const response = await handler(request)

    response.headers.set('X-RateLimit-Limit', String(config.uniqueTokenPerInterval))
    response.headers.set(
      'X-RateLimit-Remaining',
      String(config.uniqueTokenPerInterval - clientData.count)
    )
    response.headers.set('X-RateLimit-Reset', String(clientData.resetTime))

    return response
  }
}

/**
 * Get unique identifier for rate limiting
 * Priority: API key > IP address > User agent hash
 */
function getIdentifier(request: NextRequest): string {
  // Check for API key
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')
  if (apiKey) {
    return `key:${apiKey}`
  }

  // Get IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

  // Add user agent for better uniqueness
  const userAgent = request.headers.get('user-agent') || ''
  const hash = simpleHash(userAgent)

  return `ip:${ip}:${hash}`
}

/**
 * Simple hash function for user agent
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // Strict: 10 requests per minute
  strict: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  },
  // Standard: 60 requests per minute
  standard: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 60,
  },
  // Generous: 100 requests per minute
  generous: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 100,
  },
  // API: 1000 requests per hour
  api: {
    interval: 60 * 60 * 1000,
    uniqueTokenPerInterval: 1000,
  },
}

/**
 * Check if API key is valid
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')
  const validKey = process.env.API_KEY

  if (!validKey) {
    // If no API key is configured, allow all requests
    return true
  }

  if (!apiKey) {
    return false
  }

  // Remove "Bearer " prefix if present
  const key = apiKey.replace(/^Bearer\s+/i, '')

  return key === validKey
}

/**
 * Require API key middleware
 */
export function requireApiKey(handler: (req: NextRequest) => Promise<NextResponse | Response>) {
  return async function apiKeyMiddleware(request: NextRequest): Promise<NextResponse | Response> {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Valid API key required. Set X-API-Key header.',
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="API"',
          },
        }
      )
    }

    return handler(request)
  }
}
