import { categories } from '@/mocks/data'
import { createWrapper } from '@/mocks/wrapper'
import { categoriesQueryOptions } from '@/queries/categoriesQueryOptions'
import { QueryClient } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { RouteComponent } from './route'

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
  queryClient.setQueryData(categoriesQueryOptions(1).queryKey, {
    data: [...categories],
    pageSize: 10,
    totalCount: categories.length,
    page: 1,
    totalPages: 1
  })
})

afterEach(() => queryClient.clear())

describe('Categories', () => {
  test('create category modal should be rendered', async () => {
    render(<RouteComponent />, {
      wrapper: wrapper
    })

    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('categories table and pagination should be rendered', async () => {
    render(<RouteComponent />, {
      wrapper: wrapper
    })

    expect(screen.getByRole('table')).toBeInTheDocument()

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(categories.length + 1)

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(4)
    expect(headers[0]).toHaveTextContent('ID')
    expect(headers[1]).toHaveTextContent('Name')
    expect(headers[2]).toHaveTextContent('Parent category')

    // Check that the table has the correct data
    categories.forEach((category, index) => {
      const row = rows[index + 1]
      expect(row).toHaveTextContent(category.id.toString())
      expect(row).toHaveTextContent(category.name)
      expect(row).toHaveTextContent(category.parentName ?? '-')
    })

    // Pagination
    const pagination = screen.getByRole('navigation')
    expect(pagination).toBeInTheDocument()
    expect(pagination).toHaveTextContent('1')
  })

  test('created category should be added to the table', async () => {
    const categoryToCreate = {
      name: 'New Category'
    }

    render(<RouteComponent />, {
      wrapper: wrapper
    })

    const createButton = screen.getByRole('button', { name: /open create category modal/i })
    await waitFor(() => expect(createButton).toBeEnabled())
    await userEvent.click(createButton)

    expect(screen.getAllByRole('row')).toHaveLength(categories.length + 1)

    const input = screen.getByLabelText(/category name/i)
    await waitFor(() => expect(input).toBeEnabled())
    await userEvent.type(input, categoryToCreate.name)

    const submitButton = screen.getByRole('button', { name: /^create category/i })
    expect(submitButton).toBeInTheDocument()
    await userEvent.click(submitButton)

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(categories.length + 1)
    const row = rows[1]
    const columns = row.querySelectorAll('td')
    const category = categories[categories.length - 1]
    expect(columns[0].textContent).toBe(category.id.toString())
    expect(columns[1].textContent).toBe(category.name)
    expect(columns[2].textContent).toBe(category.parentName ?? '-')
  })

  test('should be able to delete a category', async () => {
    render(<RouteComponent />, {
      wrapper: wrapper
    })

    const rows = screen.getAllByRole('row')
    const deleteButton = rows[1].querySelector('button[aria-label="Delete category"]')
    if (!deleteButton) {
      throw new Error('Delete button not found')
    }

    expect(screen.getAllByRole('row')).toHaveLength(categories.length + 1)

    expect(deleteButton).toBeInTheDocument()
    await userEvent.click(deleteButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /are you sure?/i })).toBeInTheDocument()

    const confirmDeleteBtn = screen.getByRole('button', { name: /confirm delete/i })
    expect(confirmDeleteBtn).toBeInTheDocument()
    await userEvent.click(confirmDeleteBtn)

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getAllByRole('row')).toHaveLength(categories.length + 1)
  })
})
