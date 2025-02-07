using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Requests
{
    public record CreateFilterOptionRequest
    {
        [MaxLength(32)]
        public string Name { get; init; }
        public int? GroupId { get; init; }
    }
}
