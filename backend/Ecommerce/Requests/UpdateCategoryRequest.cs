using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Requests
{
    public record UpdateCategoryRequest
    {
        [MaxLength(32)]
        public string Name { get; init; }

        public int? ParentId { get; init; }
    }
}
