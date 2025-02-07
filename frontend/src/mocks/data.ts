import { type Category } from '@/services/categoriesService'
import { Product } from '@/services/productsService'

const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Parent Category',
    parentId: null,
    parentName: null
  },
  {
    id: 2,
    name: 'Child Category',
    parentId: 1,
    parentName: 'Parent Category'
  }
]

export let categories = [...initialCategories]

export function resetCategories() {
  categories = [...initialCategories]
}

export function addCategory(category: Category) {
  categories.push(category)
}

export function removeCategory(id: number) {
  categories = categories.filter((c) => c.id !== id)
}

export function updateCategory(id: number, name: string, parentId: number | null) {
  const category = categories.find((c) => c.id === id)
  if (!category) {
    throw new Error('Category not found')
  }
  category.name = name
  category.parentId = parentId
}

export function getCategory(id: number) {
  return categories.find((c) => c.id === id)
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    price: 100,
    stock: 10,
    category: categories[0],
    description: '',
    images: []
  },
  {
    id: 2,
    name: 'Product 2',
    price: 200,
    stock: 20,
    category: categories[1],
    description: '',
    images: []
  },
  {
    id: 3,
    name: 'Product 3',
    price: 300,
    stock: 30,
    category: categories[1],
    description: '',
    images: []
  }
]

export let products = [...initialProducts]

export function resetProducts() {
  products = [...initialProducts]
}

export function addProduct(product: Product) {
  products.push(product)
}

export function removeProduct(id: number) {
  products = products.filter((p) => p.id !== id)
}

export function updateProduct(id: number, name: string, price: number, stock: number) {
  const product = products.find((p) => p.id === id)
  if (!product) {
    throw new Error('Product not found')
  }
  product.name = name
  product.price = price
  product.stock = stock
}

export function getProduct(id: number) {
  return products.find((p) => p.id === id)
} 