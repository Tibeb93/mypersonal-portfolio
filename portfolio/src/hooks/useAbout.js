import { useQuery } from '@tanstack/react-query'
import { aboutAPI } from '../services/api'

const CACHE_KEY = 'portfolio-about-cache'

function getCachedAbout() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setCachedAbout(about) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(about))
  } catch {}
}

export default function useAbout() {
  const cached = getCachedAbout()

  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn:  async () => {
      const res = await aboutAPI.get()
      if (res?.data?.about) setCachedAbout(res.data.about)
      return res
    },
    staleTime:    5 * 60 * 1000,
    retry:        1,
    refetchOnWindowFocus: true,
    refetchOnReconnect:   true,
    placeholderData: cached ? () => ({ data: { about: cached } }) : undefined,
  })

  return {
    about: data?.data?.about ?? cached ?? null,
    isLoading,
  }
}
