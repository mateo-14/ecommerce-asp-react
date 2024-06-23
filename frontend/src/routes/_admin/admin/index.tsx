import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/')({
  component: () => (
    <div>
      <h1>Hello /admin!</h1>
    </div>
  )
})
