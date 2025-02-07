using Ecommerce.Models;

namespace Ecommerce.DTOs
{
    public record ProductDto(int Id, string Name, string? Slug, string? Description, decimal Price, int Stock, List<string> Images, Category? Category, List<FilterOptionDto> Filters);
}
