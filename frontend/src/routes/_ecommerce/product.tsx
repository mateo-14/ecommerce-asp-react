import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ecommerce/product')({
  component: () => <div>Hello /_ecommerce/product!</div>
})