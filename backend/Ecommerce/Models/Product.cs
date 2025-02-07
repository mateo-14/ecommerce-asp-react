using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Models
{
    public class Product
    {
        public int Id { get; set; }
        [MaxLength(120)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(160)]
        public string? Slug { get; set; }
        [MaxLength(512)]
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        [MaxLength(10)]
        public List<string> Images { get; set; } = new();
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
        public IEnumerable<FilterOption> Filters { get; set; } = new List<FilterOption>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
