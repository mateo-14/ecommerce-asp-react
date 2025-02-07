import { ConfirmDeleteProduct } from '@/components/products/confirm-delete-product'
import { CreateProductModal } from '@/components/products/create-product-modal'
import { Button } from '@/components/ui/button'
import { CustomPagination } from '@/components/ui/custom-pagination'
import { productsQueryOptions } from '@/queries/productsQueryOptions'
import { deleteProduct, Product } from '@/services/productsService'
import { Flex, Heading, IconButton, Table } from '@chakra-ui/react'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'
import { HiMiniPencilSquare, HiOutlinePlusSmall, HiTrash } from 'react-icons/hi2'

type ProductsSearch = {
  page?: number
}

export const Route = createFileRoute('/_dashboard/products')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    const page = Number(search.page) || 1
    return { page }
  },
  loaderDeps: ({ search: { page } }) => ({
    page
  }),
  loader: ({ context: { queryClient }, deps: { page } }) => {
    return queryClient.ensureQueryData(productsQueryOptions(page))
  },
  pendingComponent: () => <div>Loading...</div>
})

export function RouteComponent() {
  const { page } = useSearch({
    from: '/_dashboard/products'
  })
  const { data } = useSuspenseQuery(productsQueryOptions(page))

  return (
    <Flex direction={'column'} height={'100%'}>
      <Flex alignItems={'center'}>
        <Heading as="h2" size="lg">
          Products
        </Heading>
        <CreateProductButton />
      </Flex>
      <ProductsTable products={data.data} />
      <CustomPagination data={data} mt={'auto'} getHref={(page) => `${Route.fullPath}?page=${page}`} />
    </Flex>
  )
}

function CreateProductButton() {
  const queryClient = useQueryClient()
  const { page } = useSearch({
    from: '/_dashboard/products'
  })
  const [createProductOpen, setCreateProductOpen] = useState(false)

  function handleCreateProduct(product: Product) {
    const products = queryClient.getQueryData(productsQueryOptions(page).queryKey)
    if (products) {
      if (products.data.length < products.pageSize) {
        queryClient.setQueryData(productsQueryOptions(page).queryKey, {
          ...products,
          data: [product, ...products.data]
        })
      }
    }
  }

  return (
    <>
      <Button
        colorPalette="purple"
        onClick={() => setCreateProductOpen(true)}
        ml={'auto'}
        aria-label="Open create product modal"
      >
        <HiOutlinePlusSmall />
        Create
      </Button>
      <CreateProductModal open={createProductOpen} onOpenChange={setCreateProductOpen} onCreate={handleCreateProduct} />
    </>
  )
}

const columnHelper = createColumnHelper<Product>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('stock', {
    header: 'Stock',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('category.name', {
    header: 'Category',
    cell: (info) => info.getValue()
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => <ProductActions product={props.row.original} />
  })
]

interface ProductsTableProps {
  products: Product[]
}

function ProductsTable({ products }: ProductsTableProps) {
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Table.ScrollArea borderWidth="1px" rounded="md" mt={4}>
      <Table.Root size="sm" stickyHeader striped>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row bg="bg.subtle" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}

interface ProductActionsProps {
  product: Product
}

function ProductActions({ product }: ProductActionsProps) {
  const queryClient = useQueryClient()
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const { page } = useSearch({
    from: '/_dashboard/products'
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      const products = queryClient.getQueryData(productsQueryOptions(page).queryKey)
      if (products?.data) {
        queryClient.setQueryData(productsQueryOptions(page).queryKey, {
          ...products,
          data: products.data.filter((p) => p.id !== product.id)
        })
      }

      queryClient.invalidateQueries({
        queryKey: productsQueryOptions(page).queryKey
      })
      setConfirmDeleteOpen(false)
    }
  })

  const handleDeleteProduct = () => {
    deleteMutation.mutate(product.id)
  }

  return (
    <Flex justifyContent={'flex-end'} gapX={2}>
      <IconButton aria-label="Edit product" rounded="full" variant="ghost" size="sm" color="fg">
        <HiMiniPencilSquare />
      </IconButton>
      <IconButton
        aria-label="Delete product"
        rounded="full"
        variant="ghost"
        size="sm"
        color="fg.error"
        onClick={() => setConfirmDeleteOpen(true)}
      >
        <HiTrash />
      </IconButton>
      <ConfirmDeleteProduct
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleDeleteProduct}
        isLoading={deleteMutation.isPending}
      />
    </Flex>
  )
}
