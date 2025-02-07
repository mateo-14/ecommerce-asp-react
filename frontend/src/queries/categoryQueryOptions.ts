import { getCategory } from '@/services/categoriesService';
import { queryOptions } from '@tanstack/react-query';

export const categoryQueryOptions = (categoryId: string) => queryOptions({
  queryKey: ['category', categoryId],
  queryFn: () => getCategory(categoryId),
  refetchOnWindowFocus: false
})