import { useQuery } from '@tanstack/react-query'
import { profileAPI } from '../services/api'

export default function useProfile() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn:  profileAPI.get,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
  return { profile: data?.data?.profile ?? null, isLoading, isError }
}
