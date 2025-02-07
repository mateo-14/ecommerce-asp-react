import { createWrapper } from '@/mocks/wrapper'
import { QueryClient } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateProductModal } from './create-product-modal'

const queryClient = new QueryClient()
const wrapper = createWrapper(queryClient)

afterEach(() => {
  queryClient.clear()
})

describe('CreateProductModal', () => {
  const mockCreateProduct = vitest.fn()

  test('displays an error message if the product name is empty', async () => {
    const user = userEvent.setup()
    render(<CreateProductModal open={true} onOpenChange={() => {}} onCreate={mockCreateProduct} />, {
      wrapper: wrapper
    })

    const button = screen.getByRole('button', { name: /create product/i })
    await waitFor(() => expect(button).toBeEnabled())
    await user.click(button)
    expect(screen.getByText(/Product name is required/i)).toBeInTheDocument()
  })

  test('displays an error message if the product price is empty', async () => {
    const user = userEvent.setup()
    render(<CreateProductModal open={true} onOpenChange={() => {}} onCreate={mockCreateProduct} />, {
      wrapper: wrapper
    })

    const button = screen.getByRole('button', { name: /create product/i })
    await waitFor(() => expect(button).toBeEnabled())

    const nameInput = screen.getByLabelText(/product name/i)
    await user.type(nameInput, 'Product')

    const priceInput = screen.getByLabelText(/price/i)
    await user.clear(priceInput)
    await user.click(button)

    expect(screen.getByText(/Price is required/i)).toBeInTheDocument()
  })

  test('displays an error message if the stock is empty', async () => {
    const user = userEvent.setup()
    render(<CreateProductModal open={true} onOpenChange={() => {}} onCreate={mockCreateProduct} />, {
      wrapper: wrapper
    })

    const button = screen.getByRole('button', { name: /create product/i })
    await waitFor(() => expect(button).toBeEnabled())

    const nameInput = screen.getByLabelText(/product name/i)
    await user.type(nameInput, 'Product')

    const stockInput = screen.getByLabelText(/stock/i)
    await user.clear(stockInput)
    await user.click(button)

    expect(screen.getByText(/Stock is required/i)).toBeInTheDocument()
  })

})
