import { ConfirmDeleteCategory } from '@/components/categories/confirm-delete-category'
import { CreateCategoryModal } from '@/components/categories/create-category-modal'
import { Button } from '@/components/ui/button'
import { CustomPagination } from '@/components/ui/custom-pagination'
import { categoriesQueryOptions } from '@/queries/categoriesQueryOptions'
import { Category, deleteCategory } from '@/services/categoriesService'
import { Flex, Heading, IconButton, Table } from '@chakra-ui/react'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  HiMiniPencilSquare,
  HiOutlinePlusSmall,
  HiTrash,
} from 'react-icons/hi2'

type CategoriesSearch = {
  page?: number
}

export const Route = createFileRoute('/_dashboard/categories')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): CategoriesSearch => {
    const page = Number(search.page) || 1
    return { page }
  },
  loaderDeps: ({ search: { page } }) => ({
    page,
  }),
  loader: ({ context: { queryClient }, deps: { page } }) => {
    return queryClient.ensureQueryData(categoriesQueryOptions(page))
  },
  pendingComponent: () => <div>Loading...</div>,
})

export function RouteComponent() {
  const { page } = useSearch({
    from: '/_dashboard/categories',
  })
  const { data } = useSuspenseQuery(categoriesQueryOptions(page))

  return (
    <Flex direction={'column'} height={'100%'}>
      <Flex alignItems={'center'}>
        <Heading as="h2" size="lg">
          Categories
        </Heading>
        <CreateCategoryButton />
      </Flex>
      <CategoriesTable categories={data.data} />
      <CustomPagination
        data={data}
        mt={'auto'}
        getHref={(page) => `${Route.fullPath}?page=${page}`}
      />
    </Flex>
  )
}

// Categories table
const columnHelper = createColumnHelper<Category>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('parentId', {
    header: 'Parent category',
    cell: (info) =>
      info.getValue()
        ? `${info.row.original.parentName} (${info.getValue()})`
        : '-',
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => <CategoryActions category={props.row.original} />,
  }),
]

interface CategoriesTableProps {
  categories: Category[]
}

function CategoriesTable({ categories }: CategoriesTableProps) {
  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table.ScrollArea borderWidth="1px" rounded="md" mt={4}>
      <Table.Root size="sm" stickyHeader striped>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row bg="bg.subtle" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}

interface CategoryActionsProps {
  category: Category
}

function CategoryActions({ category }: CategoryActionsProps) {
  const queryClient = useQueryClient()
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const { page } = useSearch({
    from: '/_dashboard/categories',
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      const categories = queryClient.getQueryData(
        categoriesQueryOptions(page).queryKey,
      )
      if (categories?.data) {
        queryClient.setQueryData(categoriesQueryOptions(page).queryKey, {
          ...categories,
          data: categories.data.filter((c) => c.id !== category.id),
        })
      }

      queryClient.invalidateQueries({
        queryKey: categoriesQueryOptions(page).queryKey,
      })
    },
  })

  const handleDeleteCategory = async () => {
    await deleteMutation.mutate(category.id)
    setConfirmDeleteOpen(false)
  }

  return (
    <Flex justifyContent={'flex-end'} gapX={2}>
      <IconButton
        aria-label="Edit category"
        rounded="full"
        variant="ghost"
        size="sm"
        color="fg"
      >
        <HiMiniPencilSquare />
      </IconButton>
      <IconButton
        aria-label="Delete category"
        rounded="full"
        variant="ghost"
        size="sm"
        color="fg.error"
        onClick={() => setConfirmDeleteOpen(true)}
      >
        <HiTrash />
      </IconButton>
      <ConfirmDeleteCategory
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleDeleteCategory}
        isLoading={deleteMutation.isPending}
      />
    </Flex>
  )
}

function CreateCategoryButton() {
  const queryClient = useQueryClient()
  const { page } = useSearch({
    from: '/_dashboard/categories',
  })
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false)

  function handleCreateCategory(category: Category) {
    const categories = queryClient.getQueryData(
      categoriesQueryOptions(page).queryKey,
    )
    if (categories) {
      if (categories.data.length < categories.pageSize) {
        queryClient.setQueryData(categoriesQueryOptions(page).queryKey, {
          ...categories,
          data: [category, ...categories.data],
          totalCount: categories.totalCount + 1
        })
      }
    }
  }

  return (
    <>
      <Button
        colorPalette="purple"
        onClick={() => setCreateCategoryOpen(true)}
        ml={'auto'}
        aria-label="Open create category modal"
      >
        <HiOutlinePlusSmall />
        Create
      </Button>
      <CreateCategoryModal
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
        onCreate={handleCreateCategory}
      />
    </>
  )
}
