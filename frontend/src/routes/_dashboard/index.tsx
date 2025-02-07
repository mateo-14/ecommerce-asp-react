import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/_dashboard/categories"!</div>
}
