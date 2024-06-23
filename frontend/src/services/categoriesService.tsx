import type { PaginatedData } from '@/types'
import { client } from './apiClientSingleton'

export interface Category {
  id: number
  name: string
  parentId: number | null
}

export function getCategories(page: number = 1, pageSize: number = 0): Promise<PaginatedData<Category>> {
  return client.get<PaginatedData<Category>>(`/api/categories?page=${page}&pageSize=${pageSize}`)
}
