using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Models
{
    public class FilterOption
    {
        public int Id { get; set; }
        [MaxLength(32)]
        public string Name { get; set; }
        public int? FilterGroupId { get; set; }
        public FilterGroup? FilterGroup { get; set; }
        public IEnumerable<Product> Products { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
