import { categories } from '@/mocks/data'
import { createWrapper } from '@/mocks/wrapper'
import { QueryClient } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { CreateCategoryModal } from './create-category-modal'

const queryClient = new QueryClient()
const wrapper = createWrapper(queryClient)

describe('CreateCategoryModal', () => {
  const mockCreateCategory = vitest.fn()

  test('displays an error message if the category name is empty', async () => {
    render(<CreateCategoryModal open={true} onOpenChange={() => {}} onCreate={mockCreateCategory} />, {
      wrapper: wrapper
    })

    await userEvent.click(screen.getByRole('button', { name: /create category/i }))

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument()
  })

  test('renders the modal and allows creating a category', async () => {
    const categoryToCreate = {
      name: 'New Category',
      parentId: null,
      parentName: null
    }

    render(<CreateCategoryModal open={true} onOpenChange={() => {}} onCreate={mockCreateCategory} />, {
      wrapper: wrapper
    })

    const input = screen.getByLabelText(/category name/i)
    await waitFor(() => expect(input).toBeEnabled())
    await userEvent.type(input, categoryToCreate.name)
    await userEvent.click(screen.getByRole('button', { name: /create category/i }))

    expect(mockCreateCategory).toHaveBeenCalledWith({
      id: categories.length,
      name: categoryToCreate.name,
      parentId: null,
      parentName: null
    })
  })

  test('renders the modal and allows creating a category with a parent', async () => {
    // Chakra select uses scrollTo internally, so we have to mock it
    Element.prototype.scrollTo = vi.fn()

    const parentCategory = categories[0]

    const categoryToCreate = {
      name: 'New Subcategory'
    }

    render(<CreateCategoryModal open={true} onOpenChange={() => {}} onCreate={mockCreateCategory} />, {
      wrapper: wrapper
    })

    const input = screen.getByLabelText(/category name/i)
    // Wait to load the categories
    await waitFor(() => expect(input).toBeEnabled())

    await userEvent.type(input, 'New Subcategory')
    const select = screen.getByRole('combobox', { name: /parent category/i })
    await userEvent.click(select)
    const option = screen.getByRole('option', { name: parentCategory.name })
    await userEvent.click(option)

    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(mockCreateCategory).toHaveBeenCalledWith({
      id: categories.length,
      name: categoryToCreate.name,
      parentId: parentCategory.id,
      parentName: parentCategory.name
    })
  })
})
