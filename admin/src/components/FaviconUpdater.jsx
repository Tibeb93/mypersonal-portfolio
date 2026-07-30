import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client.js'

/**
 * Silently updates the browser favicon and page title
 * from the settings API without requiring a page reload.
 */
export default function FaviconUpdater() {
  const { data } = useQuery({
    queryKey: ['public-settings'],
    queryFn:  () => api.get('/settings/public'),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  useEffect(() => {
    const settings = data?.data?.settings
    if (!settings) return

    // Update favicon
    if (settings.favicon) {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll("link[rel*='icon']")
      existingLinks.forEach(l => l.parentNode?.removeChild(l))

      // Add new favicon
      const link = document.createElement('link')
      link.rel  = 'icon'
      link.href = settings.favicon
      document.head.appendChild(link)
    }

    // Update page title
    if (settings.siteTitle) {
      document.title = `Admin — ${settings.siteTitle}`
    }
  }, [data])

  return null // renders nothing
}
