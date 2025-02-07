import { type PaginatedData } from '@/types'
import { client } from './apiClientSingleton'
import { type Category } from './categoriesService'

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  category?: Category | null
  description: string
  images: string[]
}

export function createProduct(name: string, price: number, stock: number, description: string, images: File[], categoryId?: number): Promise<Product> {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('price', price.toString())
  formData.append('stock', stock.toString())

  if (categoryId) {
    formData.append('categoryId', categoryId.toString())
  }

  formData.append('description', description)
  for (const image of images) {
    formData.append('images', image)
  }

  return client.postForm<Product>('/api/products', formData)
}

export function getProducts(page: number = 1, pageSize: number = 0): Promise<PaginatedData<Product>> {
  return client.get<PaginatedData<Product>>(`/api/products?page=${page}&pageSize=${pageSize}`)
}

export function deleteProduct(id: number): Promise<void> {
  return client.delete<void>(`/api/products/${id}`)
}
