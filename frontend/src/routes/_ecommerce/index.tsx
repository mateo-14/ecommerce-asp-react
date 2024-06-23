import { Button } from "@/components/ui/button"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ecommerce/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <Button>Click me</Button>
    </div>
  )
}