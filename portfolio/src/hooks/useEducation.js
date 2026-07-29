import { useQuery } from '@tanstack/react-query'
import { educationAPI } from '../services/api'

export default function useEducation() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['education'],
    queryFn:  educationAPI.getAll,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
  return { educations: data?.data?.educations ?? [], isLoading, isError }
}
