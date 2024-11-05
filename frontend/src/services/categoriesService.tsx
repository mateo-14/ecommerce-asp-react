import type { PaginatedData } from '@/types'
import { client } from './apiClientSingleton'

export interface Category {
  id: number
  name: string
  parentId: number | null
  parentName: string | null
}

export function getCategories(page: number = 1, pageSize: number = 0): Promise<PaginatedData<Category>> {
  return client.get<PaginatedData<Category>>(`/api/categories?page=${page}&pageSize=${pageSize}`)
}

export function createCategory(name: string, parentId?: number): Promise<Category> {
  return client.post<Category>('/api/categories', {
    name,
    parentId
  })
}

export function deleteCategory(id: number): Promise<void> {
  return client.delete<void>(`/api/categories/${id}`)
}

export function getCategory(id: string): Promise<Category> {
  return client.get<Category>(`/api/categories/${id}`)
}

export function updateCategory(id: string, name: string, parentId: number | null): Promise<Category> {
  return client.put<Category>(`/api/categories/${id}`, {
    name,
    parentId
  })
}