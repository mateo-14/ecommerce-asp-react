import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/filters')({
  component: () => <div>Hello /_admin/admin/filters!</div>
})