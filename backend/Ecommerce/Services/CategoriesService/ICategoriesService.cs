using Ecommerce.DTOs;
using Ecommerce.Requests;
using LightResults;

namespace Ecommerce.Services.CategoriesService
{
    public interface ICategoriesService
    {
        public Task<Result<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest category);
        public Task<Result> DeleteCategoryAsync(int id);
        public Task<PaginatedDataDto<CategoryDto>> GetCategoriesAsync(int page = 1, int pageSize = 0);
        public Task<Result<CategoryDto>> GetCategoryAsync(int id);
        public Task<Result<CategoryDto>> UpdateCategoryAsync(int id, UpdateCategoryRequest category);
    }
}
