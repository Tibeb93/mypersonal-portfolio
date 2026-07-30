import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Invalidates all queries when:
 * 1. The user switches back to this tab (visibilitychange)
 * 2. The window gains focus
 *
 * This means: any change made in the admin dashboard is reflected
 * on the portfolio within seconds of the user returning to it —
 * no manual page refresh needed.
 */
export default function useRealtimeRefresh() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const invalidateAll = () => {
      queryClient.invalidateQueries()
    }

    // Refetch when tab becomes visible again
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        invalidateAll()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [queryClient])
}
