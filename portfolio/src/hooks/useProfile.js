import { useQuery } from '@tanstack/react-query'
import { profileAPI } from '../services/api'

const CACHE_KEY = 'portfolio-profile-cache'

function getCachedProfile() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setCachedProfile(profile) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(profile))
  } catch {}
}

export default function useProfile() {
  const cached = getCachedProfile()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn:  async () => {
      const res = await profileAPI.get()
      if (res?.data?.profile) setCachedProfile(res.data.profile)
      return res
    },
    staleTime:    30 * 1000,
    gcTime:       5  * 60 * 1000,
    retry:        2,
    refetchOnWindowFocus: true,
    refetchOnReconnect:   true,
    placeholderData: cached ? () => ({ data: { profile: cached } }) : undefined,
  })

  return {
    profile: data?.data?.profile ?? cached ?? null,
    isLoading,
    isError,
  }
}
