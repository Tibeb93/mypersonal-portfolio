import { useQuery } from '@tanstack/react-query'
import { settingsAPI } from '../services/api'

export default function useSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn:  settingsAPI.getPublic,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  })
  return { settings: data?.data?.settings ?? null, isLoading }
}
