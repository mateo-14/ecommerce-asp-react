import { getCategories } from '@/services/categoriesService';
import { queryOptions } from '@tanstack/react-query';

export const categoriesQueryOptions = (page: number = 1, pageSize: number = 10) => queryOptions({
  queryKey: ['categories', { page, pageSize }],
  queryFn: () => getCategories(page, pageSize),
})