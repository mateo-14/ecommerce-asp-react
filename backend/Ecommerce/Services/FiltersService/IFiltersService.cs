using Ecommerce.DTOs;
using Ecommerce.Requests;
using LightResults;

namespace Ecommerce.Services.FiltersService
{
    public interface IFiltersService
    {
        public Task<FilterGroupDto> CreateFilterGroupAsync(CreateFilterGroupRequest data);
        public Task<Result> DeleteFilterGroupAsync(int id);
        public Task<PaginatedDataDto<FilterGroupDto>> GetFilterGroupsAsync(int page = 1, int pageSize = 0);
        public Task<Result<FilterOptionDto>> CreateFilterOptionAsync(CreateFilterOptionRequest data);
        public Task<Result> DeleteFilterOptionAsync(int id);
        public Task<PaginatedDataDto<FilterOptionDto>> GetFilterOptionsAsync(int page = 1, int pageSize = 0);
    }
}
