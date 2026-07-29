import { useQuery } from '@tanstack/react-query'
import { experienceAPI } from '../services/api'

export default function useExperience() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experience'],
    queryFn:  experienceAPI.getAll,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
  return { experiences: data?.data?.experiences ?? [], isLoading, isError }
}
