import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Invalidates all queries when:
 * 1. The user switches back to this tab (visibilitychange)
 * 2. The window gains focus
 * 3. Network comes back online
 */
export default function useRealtimeRefresh() {
  const queryClient = useQueryClient()
  const lastInvalidation = useRef(0)

  useEffect(() => {
    const invalidateAll = () => {
      const now = Date.now()
      if (now - lastInvalidation.current < 3000) return
      lastInvalidation.current = now
      queryClient.invalidateQueries()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        invalidateAll()
      }
    }

    const onFocus = () => invalidateAll()
    const onOnline = () => invalidateAll()

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', onFocus)
    window.addEventListener('online', onOnline)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('online', onOnline)
    }
  }, [queryClient])
}
