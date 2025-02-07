import { getProducts } from '@/services/productsService'
import { queryOptions } from '@tanstack/react-query'

export const productsQueryOptions = (page: number = 1, pageSize: number = 10) => queryOptions({
  queryKey: ['products', { page, pageSize }],
  queryFn: () => getProducts(page, pageSize),
})