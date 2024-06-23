export interface PaginatedData<T> {
  data: T[]
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
}