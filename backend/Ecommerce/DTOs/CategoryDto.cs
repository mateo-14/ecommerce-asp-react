namespace Ecommerce.DTOs
{
    public record CategoryDto(int Id, string Name, int? ParentId, string? ParentName = null);
}
