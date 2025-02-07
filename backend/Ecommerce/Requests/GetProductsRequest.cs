namespace Ecommerce.Requests
{
    public record GetProductsRequest
    {
        public string Search { get; init; } = string.Empty;
        public int Page { get; init; } = 1;
        public string Order { get; init; } = "asc";
        public string OrderBy { get; init; } = "name";
        public int[] Categories { get; init; } = Array.Empty<int>();
        public int[] Filters { get; init; } = Array.Empty<int>();
        public int PageSize { get; init; } = 10;
    }
}
