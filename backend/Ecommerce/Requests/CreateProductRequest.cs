using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Requests
{
    public record CreateProductRequest
    {
        [MaxLength(120)]
        public required string Name { get; init; }
        [MaxLength(512)]
        public string? Description { get; init; }
        [Range(0, 10000000)]
        public decimal Price { get; init; }
        [Range(0, 10000000)]
        public int Stock { get; init; }
        [MaxLength(10)]
        public List<IFormFile>? Images { get; init; }
        public int? CategoryId { get; init; }
        public List<int>? FiltersIds { get; init; }
    }
}
