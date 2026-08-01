import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'https://portfolio-backend-jwdp.onrender.com'

/**
 * Real-time refresh using Socket.IO + visibility/focus/online fallbacks.
 * When admin updates data, the portfolio instantly reflects changes.
 */
export default function useRealtimeRefresh() {
  const queryClient = useQueryClient()
  const lastInvalidation = useRef(0)

  useEffect(() => {
    const invalidateAll = (reason) => {
      const now = Date.now()
      if (now - lastInvalidation.current < 2000) return
      lastInvalidation.current = now
      queryClient.invalidateQueries()
    }

    // ── Socket.IO connection ──────────────────────────────────────────────
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })

    socket.on('data:changed', (payload) => {
      // Invalidate specific resource or all queries
      if (payload?.resource) {
        queryClient.invalidateQueries({ queryKey: [payload.resource] })
      }
      queryClient.invalidateQueries()
    })

    socket.on('connect_error', () => {
      // Silently handle — fallback to visibility/focus events
    })

    // ── Fallback events ───────────────────────────────────────────────────
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') invalidateAll('visibility')
    }
    const onFocus = () => invalidateAll('focus')
    const onOnline = () => invalidateAll('online')

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', onFocus)
    window.addEventListener('online', onOnline)

    return () => {
      socket.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('online', onOnline)
    }
  }, [queryClient])
}
