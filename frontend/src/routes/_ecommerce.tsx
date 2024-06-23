import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ecommerce')({
  component: () => (
    <div>
      Ecommerce layout
      <Outlet />
    </div>
  )
})
