import { HStack } from '@chakra-ui/react'
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  type PaginationRootProps
} from './pagination'
import { type PaginatedData } from '@/types'

interface PaginationProps<T> extends Omit<PaginationRootProps, 'count' | 'pageSize' | 'page'> {
  data: PaginatedData<T>
}

export function CustomPagination<T>({ data, ...props }: PaginationProps<T>) {
  return (
    <PaginationRoot {...props} count={data.totalCount} pageSize={data.pageSize} page={data.page}>
      <HStack>
        <PaginationPrevTrigger />
        <PaginationItems />
        <PaginationNextTrigger />
      </HStack>
    </PaginationRoot>
  )
}
