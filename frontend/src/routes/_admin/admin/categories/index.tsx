import AdminHeader from '@/components/ui/AdminHeader'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { categoriesQueryOptions } from '@/queries/categoriesQueryOptions'
import { deleteCategory, type Category } from '@/services/categoriesService'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { LoaderCircle, MoreHorizontal } from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/categories/')({
  component: Page,
  validateSearch: (search) => {
    return {
      page: Number(search?.page ?? 1)
    }
  },
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ context: { queryClient }, deps: { page } }) =>
    queryClient.ensureQueryData(categoriesQueryOptions(page, 10)),
  pendingComponent: () => <div>Loading...</div>
})

function Page() {
  const page = Route.useSearch().page
  const { isFetching } = useSuspenseQuery(categoriesQueryOptions(page, 10))

  return (
    <div className="h-full flex flex-col">
      <AdminHeader title="Categories" path="/Categories">
        <Button
          asChild
          className="aria-disabled:cursor-default aria-disabled:opacity-50 aria-disabled:pointer-events-none"
          disabled={isFetching}
        >
          <Link to="/admin/categories/create">Create</Link>
        </Button>
      </AdminHeader>

      <Categories />
    </div>
  )
}

const columnHelper = createColumnHelper<Category>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('parentId', {
    header: 'Parent',
    cell: (info) => (info.getValue() ? `${info.row.original.parentName} (${info.getValue()})` : 'Root')
  })
]

function Categories() {
  const page = Route.useSearch().page
  const { data, isFetching } = useSuspenseQuery(categoriesQueryOptions(page, 10))

  const table = useReactTable({
    data: data.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel<Category>()
  })
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoriesQueryOptions(page, 4).queryKey
      })
    }
  })

  const handleDeleteCategory = (category: Category) => {
    deleteMutation.mutate(category.id)
  }

  return (
    <div className="flex flex-col h-full">
      {isFetching && (
        <div className="flex items-center justify-center mt-4 w-full">
          <LoaderCircle width={48} height={48} className="animate-spin" />
        </div>
      )}
      <div className="rounded-md border my-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
                <TableCell className="text-right">
                  <AlertDialog>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/categories/edit/${row.original.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="focus:bg-red-700"
                            color="red"
                            // onClick={() => setCategoryToDelete(row.original)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ConfirmCategoryDeleteAlertDialogContent onConfirm={() => handleDeleteCategory(row.original)} />
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-auto mb-6">
        <CategoriesPagination page={page} totalPages={data.totalPages} />
      </div>

      <Dialog open={deleteMutation.isPending}>
        <DialogContent hideCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Deleting category...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <LoaderCircle width={64} height={64} className="animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ConfirmCategoryDeleteAlertDialogContentProps {
  onConfirm: () => void
}
function ConfirmCategoryDeleteAlertDialogContent({ onConfirm }: ConfirmCategoryDeleteAlertDialogContentProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the category.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Accept</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

interface CategoriesPaginationProps {
  page: number
  totalPages: number
}
const VISIBLE_PAGES = 5
function CategoriesPagination({ page, totalPages }: CategoriesPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const pagesToShow = pages?.slice(
    Math.max(0, Math.min(pages.indexOf(page) - Math.floor(VISIBLE_PAGES / 2), pages.length - VISIBLE_PAGES)),
    Math.min(pages.length, Math.max(pages.indexOf(page) + Math.ceil(VISIBLE_PAGES / 2), VISIBLE_PAGES))
  )

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious to="/admin/categories" search={{ page: page - 1 }} />
          </PaginationItem>
        )}

        {pagesToShow.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink isActive={pageNumber === page} to="/admin/categories" search={{ page: pageNumber }}>
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {page < totalPages && (
          <PaginationItem>
            <PaginationNext to="/admin/categories" search={{ page: page + 1 }} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
