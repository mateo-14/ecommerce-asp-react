import CategoryForm, { type CategoryFormValues } from '@/components/CategoryForm'
import AdminHeader from '@/components/ui/AdminHeader'
import { Button } from '@/components/ui/button'
import { categoriesQueryOptions } from '@/queries/categoriesQueryOptions'
import { createCategory } from '@/services/categoriesService'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/categories/create')({
  component: Page,
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(categoriesQueryOptions())
})

function Page() {
  const { data } = useSuspenseQuery(categoriesQueryOptions())
  const navigate = useNavigate()

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await createCategory(data.name, data.parent?.id)
      navigate({
        to: '/admin/categories',
        search: { page: 1 }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <AdminHeader title="Create category" path="/Categories/Create">
        <Button asChild>
          <Link to="/admin/categories" search={{ page: 1 }}>
            Categories
          </Link>
        </Button>
      </AdminHeader>
      <CategoryForm categories={data.data ?? []} onSubmit={onSubmit} />
    </div>
  )
}
