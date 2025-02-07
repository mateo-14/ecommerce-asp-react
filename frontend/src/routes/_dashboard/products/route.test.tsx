import { createWrapper } from '@/mocks/wrapper'
import { QueryClient } from '@tanstack/react-query'
import { RouteComponent } from './route'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { categories, products } from '@/mocks/data'
import { productsQueryOptions } from "@/queries/productsQueryOptions"

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...(original as object),
    useSearch: vi.fn(() => ({
      page: 1
    })),
    createLink: vi.fn(() => (props: React.RefAttributes<HTMLAnchorElement>) => <a {...props} />)
  }
})

const queryClient = new QueryClient()
const wrapper = createWrapper(queryClient)

beforeEach(() => {
  queryClient.setQueryData(productsQueryOptions(1).queryKey, {
    data: [...products],
    pageSize: 10,
    totalCount: products.length,
    page: 1,
    totalPages: 1
  })
})

afterEach(() => queryClient.clear())

describe('Products', () => {
  test('create product modal should be rendered', async () => {
    render(<RouteComponent />, {
      wrapper: wrapper
    })

    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('products table and pagination should be rendered', async () => {
    render(<RouteComponent />, {
      wrapper: wrapper
    })

    expect(screen.getByRole('table')).toBeInTheDocument()

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(products.length + 1)

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(6)
    expect(headers[0]).toHaveTextContent('ID')
    expect(headers[1]).toHaveTextContent('Name')
    expect(headers[2]).toHaveTextContent('Price')
    expect(headers[3]).toHaveTextContent('Stock')
    expect(headers[4]).toHaveTextContent('Category')

    // Check that the table has the correct data
    products.forEach((product, index) => {
      const row = rows[index + 1]
      expect(row).toHaveTextContent(product.id.toString())
      expect(row).toHaveTextContent(product.name)
      expect(row).toHaveTextContent(product.price.toString())
      expect(row).toHaveTextContent(product.stock.toString())
      if (product.category) {
        expect(row).toHaveTextContent(product.category.name)
      }
    })

    // Pagination
    const pagination = screen.getByRole('navigation')
    expect(pagination).toBeInTheDocument()
    expect(pagination).toHaveTextContent('1')
  })

  test('created product should be added to the table', async () => {
    const user = userEvent.setup()
    Element.prototype.scrollTo = vi.fn()

    const productToCreate = {
      name: 'New Product',
      price: 100,
      stock: 10
    }
    render(<RouteComponent />, {
      wrapper: wrapper
    })

    const createButton = screen.getByRole('button', { name: /open create product modal/i })
    await waitFor(() => expect(createButton).toBeEnabled())
    await user.click(createButton)

    expect(screen.getAllByRole('row')).toHaveLength(products.length + 1)

    // Select
    const select = screen.getByRole('combobox', { name: /category/i })
    await user.click(select)
    const option = screen.getByRole('option', { name: categories[0].name })
    await user.click(option)
    const input = screen.getByLabelText(/product name/i)
    await waitFor(() => expect(input).toBeEnabled())
    await user.type(input, productToCreate.name)

    const submitButton = screen.getByRole('button', { name: /^create product/i })
    expect(submitButton).toBeInTheDocument()
    await user.click(submitButton)
    
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(products.length + 1)
    const row = rows[1]
    const columns = row.querySelectorAll('td')
    const product = products[products.length - 1]
    expect(columns[0].textContent).toBe(product.id.toString())
    expect(columns[1].textContent).toBe(product.name)
    expect(columns[2].textContent).toBe(product.price.toString())
    expect(columns[3].textContent).toBe(product.stock.toString())
    if (product.category) {
      expect(columns[4].textContent).toBe(product.category.name)
    }
  })

  test('should be able to delete a product', async () => {
    const user = userEvent.setup()
    render(<RouteComponent />, {
      wrapper: wrapper
    })

    const rows = screen.getAllByRole('row')
    const deleteButton = rows[1].querySelector('button[aria-label="Delete product"]')
    if (!deleteButton) {
      throw new Error('Delete button not found')
    }

    expect(screen.getAllByRole('row')).toHaveLength(products.length + 1)

    expect(deleteButton).toBeInTheDocument()
    await user.click(deleteButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /are you sure?/i })).toBeInTheDocument()

    const confirmDeleteBtn = screen.getByRole('button', { name: /confirm delete/i })
    expect(confirmDeleteBtn).toBeInTheDocument()
    await user.click(confirmDeleteBtn)

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getAllByRole('row')).toHaveLength(products.length + 1)
  })
})
