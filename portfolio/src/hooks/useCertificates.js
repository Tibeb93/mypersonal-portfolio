import { useQuery } from '@tanstack/react-query'
import { certificatesAPI } from '../services/api'

export default function useCertificates() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['certificates'],
    queryFn:  certificatesAPI.getAll,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
  return { certificates: data?.data?.certificates ?? [], isLoading, isError }
}
