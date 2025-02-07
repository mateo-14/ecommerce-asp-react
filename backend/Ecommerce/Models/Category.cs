using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Models
{
    public class Category
    {
        public int Id { get; set; }
        [MaxLength(32)]
        public string Name { get; set; }
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<Category> SubCategories { get; set; }
        public int? ParentId { get; set; }
        public Category? Parent { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
