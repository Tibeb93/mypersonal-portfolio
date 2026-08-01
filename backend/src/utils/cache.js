// Simple in-memory cache for public API responses
// Reduces DB load and speeds up repeated requests

const store = new Map()

const DEFAULT_TTL = 60 * 1000 // 60 seconds

/**
 * Get cached value by key
 * @param {string} key
 * @returns {*} cached value or undefined
 */
export const cacheGet = (key) => {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return undefined
  }
  return entry.value
}

/**
 * Set a value in cache with TTL
 * @param {string} key
 * @param {*} value
 * @param {number} ttlMs - time to live in milliseconds
 */
export const cacheSet = (key, value, ttlMs = DEFAULT_TTL) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  })
}

/**
 * Invalidate cache entries matching a prefix
 * @param {string} prefix - e.g. 'projects' invalidates 'projects:all', 'projects:featured', etc.
 */
export const cacheInvalidate = (prefix) => {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key)
    }
  }
}

/**
 * Clear entire cache
 */
export const cacheClear = () => {
  store.clear()
}

/**
 * Express middleware helper — serves from cache or calls next
 * @param {string} key - cache key
 * @param {number} ttlMs - TTL in ms
 */
export const withCache = (key, ttlMs = DEFAULT_TTL) => (req, res, next) => {
  const cached = cacheGet(key)
  if (cached) {
    return res.json(cached)
  }
  // Intercept res.json to cache the response
  const originalJson = res.json.bind(res)
  res.json = (body) => {
    if (body?.success !== false) {
      cacheSet(key, body, ttlMs)
    }
    return originalJson(body)
  }
  next()
}
