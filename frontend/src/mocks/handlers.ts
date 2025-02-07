import { PaginatedData } from '@/types'
import { http, HttpResponse } from 'msw'
import { type Category } from '@/services/categoriesService'
import { addCategory, addProduct, categories, getCategory, getProduct, products, removeCategory, removeProduct } from './data'
import { type Product } from '@/services/productsService'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string

export const handlers = [
  // Categories
  http.get(`${apiBaseUrl}/api/categories`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 0

    return HttpResponse.json<PaginatedData<Category>>({
      data: categories,
      pageSize: pageSize,
      totalCount: categories.length,
      page: page,
      totalPages: 1
    })
  }),


  http.post(`${apiBaseUrl}/api/categories`, async ({ request }) => {
    const body = await request.json() as { name: string; parentId?: number }

    let parentCategory: Category | undefined
    if (body.parentId) {
      parentCategory = getCategory(body.parentId)
      if (!parentCategory) {
        return HttpResponse.json({ message: 'Parent category not found' }, { status: 404 })
      }
    }

    const category: Category = {
      id: categories.length + 1,
      name: body.name,
      parentId: parentCategory?.id || null,
      parentName: parentCategory?.name || null
    }

    addCategory(category)
    return HttpResponse.json(category)
  }),


  http.delete(`${apiBaseUrl}/api/categories/:id`, ({ params }) => {
    const { id } = params
    if (!id) {
      return HttpResponse.json({ message: 'Invalid id' }, { status: 400 })
    }

    const category = getCategory(Number(id))

    if (!category) {
      return HttpResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    removeCategory(category.id)

    return HttpResponse.json(null, { status: 200 })
  }),

  // Products
  http.get(`${apiBaseUrl}/api/products`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 0

    return HttpResponse.json<PaginatedData<Product>>({
      data: products,
      pageSize: pageSize,
      totalCount: products.length,
      page: page,
      totalPages: 1
    })
  }),

  http.post(`${apiBaseUrl}/api/products`, async ({ request }) => {
    const data = await request.formData()
    if (!data.has('name') || !data.has('price') || !data.has('stock')) {
      return HttpResponse.json({ message: 'Invalid request' }, { status: 400 })
    }

    let category: Category | undefined
    if (data.has('categoryId')) {
      category = getCategory(Number(data.get('categoryId')))
      if (!category) {
        return HttpResponse.json({ message: 'Category not found' }, { status: 404 })
      }
    }

    const product: Product = {
      id: products.length + 1,
      name: data.get('name')?.toString() ?? '',
      price: Number(data.get('price')),
      stock: Number(data.get('stock')),
      category: category,
      description: data.get('description')?.toString() ?? '',
      images: []
    }

    addProduct(product)
    return HttpResponse.json(product)
  }),

  http.delete(`${apiBaseUrl}/api/products/:id`, ({ params }) => {
    const { id } = params
    if (!id) {
      return HttpResponse.json({ message: 'Invalid id' }, { status: 400 })
    }

    const product = getProduct(Number(id))

    if (!product) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    removeProduct(product.id)

    return HttpResponse.json(null, { status: 200 })
  }),
]