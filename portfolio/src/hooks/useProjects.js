import { useQuery } from '@tanstack/react-query'
import { projectsAPI } from '../services/api'

export default function useProjects(params = {}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projects', params],
    queryFn:  () => projectsAPI.getAll(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
  return {
    projects:   data?.data   ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    isError,
  }
}
