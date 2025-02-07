using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Models
{
    public class FilterGroup
    {
        public int Id { get; set; }
        [MaxLength(32)]
        public string Name { get; set; }
        public IEnumerable<FilterOption> Options { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
