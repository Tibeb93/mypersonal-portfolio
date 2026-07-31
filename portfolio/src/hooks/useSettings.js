import { useQuery } from '@tanstack/react-query'
import { settingsAPI } from '../services/api'

const CACHE_KEY = 'portfolio-settings-cache'

function getCachedSettings() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setCachedSettings(settings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(settings))
  } catch {}
}

export default function useSettings() {
  const cached = getCachedSettings()

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn:  async () => {
      const res = await settingsAPI.getPublic()
      if (res?.data?.settings) setCachedSettings(res.data.settings)
      return res
    },
    staleTime:    5 * 60 * 1000,
    retry:        1,
    refetchOnWindowFocus: true,
    refetchOnReconnect:   true,
    placeholderData: cached ? () => ({ data: { settings: cached } }) : undefined,
  })

  return {
    settings: data?.data?.settings ?? cached ?? null,
    isLoading,
  }
}
