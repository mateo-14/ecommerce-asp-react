namespace Ecommerce.DTOs
{
    public record PaginatedDataDto<T>(List<T> Data, int Page, int PageSize, int TotalPages, int TotalCount);
}
