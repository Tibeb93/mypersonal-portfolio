import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Short stale time = content refreshes quickly after admin updates
      staleTime:  30 * 1000,          // 30 seconds — data is "fresh" for 30s
      gcTime:     5  * 60 * 1000,     // 5 min cache
      retry:      2,
      // Refetch when user comes back to the tab (e.g. after admin edit)
      refetchOnWindowFocus:      true,
      // Refetch when network comes back online
      refetchOnReconnect:        true,
      // Background refetch every 60 seconds while the tab is visible
      refetchInterval:           60 * 1000,
      // Only poll when the tab is in the foreground
      refetchIntervalInBackground: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A2238',
              color: '#e2e8f0',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
)
