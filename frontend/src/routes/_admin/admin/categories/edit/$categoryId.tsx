import CategoryForm, { type CategoryFormValues } from '@/components/CategoryForm'
import AdminHeader from '@/components/ui/AdminHeader'
import { Button } from '@/components/ui/button'
import { categoriesQueryOptions } from '@/queries/categoriesQueryOptions'
import { categoryQueryOptions } from '@/queries/categoryQueryOptions'
import { updateCategory } from '@/services/categoriesService'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/categories/edit/$categoryId')({
  component: Page,
  loader: ({ params: { categoryId }, context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(categoriesQueryOptions()),
      queryClient.ensureQueryData(categoryQueryOptions(categoryId))
    ])
})

function Page() {
  const navigate = useNavigate()
  const { categoryId } = Route.useParams()
  const { data: category, isFetching } = useSuspenseQuery(categoryQueryOptions(categoryId))
  const { data } = useSuspenseQuery(categoriesQueryOptions())

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      let parentId: number | null = data.parent?.id !== undefined ? data.parent?.id : null
      if (parentId === 0) {
        parentId = null
      }

      await updateCategory(categoryId, data.name, parentId)
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
      <AdminHeader title="Edit category" path={`/Categories/Edit category ${categoryId}`}>
        <Button asChild>
          <Link to="/admin/categories" search={{ page: 1 }}>
            Categories
          </Link>
        </Button>
      </AdminHeader>
      {!isFetching && <CategoryForm categories={data.data ?? []} onSubmit={onSubmit} categoryToEdit={category} />}
    </div>
  )
}
