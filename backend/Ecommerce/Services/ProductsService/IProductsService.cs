using Ecommerce.DTOs;
using Ecommerce.Requests;
using LightResults;

namespace Ecommerce.Services.ProductService
{
    public interface IProductsService
    {
        public Task<Result<ProductDto>> CreateProductAsync(CreateProductRequest data);
        public Task<Result> DeleteProductAsync(int id);
        public Task<PaginatedDataDto<ProductDto>> GetProductsAsync(GetProductsRequest query);
    }
}
