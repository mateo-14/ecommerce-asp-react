using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Requests
{
    public record CreateFilterGroupRequest
    {
        [MaxLength(32)]
        public string Name { get; init; }

    }
}
