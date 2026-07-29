import { useQuery } from '@tanstack/react-query'
import { skillsAPI } from '../services/api'

export default function useSkills(category) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['skills', category],
    queryFn:  () => skillsAPI.getAll(category),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
  return {
    skills:  data?.data?.skills  ?? [],
    grouped: data?.data?.grouped ?? {},
    isLoading,
    isError,
  }
}
