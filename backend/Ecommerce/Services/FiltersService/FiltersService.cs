using Ecommerce.Data;
using Ecommerce.DTOs;
using Ecommerce.Models;
using Ecommerce.Requests;
using LightResults;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services.FiltersService
{
    public class FiltersService : IFiltersService
    {
        private readonly AppDbContext _context;
        public FiltersService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<FilterGroupDto> CreateFilterGroupAsync(CreateFilterGroupRequest data)
        {
            var filterGroup = new FilterGroup
            {
                Name = data.Name
            };

            _context.FilterGroups.Add(filterGroup);
            await _context.SaveChangesAsync();

            return new FilterGroupDto(filterGroup.Id, filterGroup.Name);
        }

        public async Task<Result<FilterOptionDto>> CreateFilterOptionAsync(CreateFilterOptionRequest data)
        {
            var filterOption = new FilterOption
            {
                Name = data.Name,
            };

            FilterGroup? filterGroup = null;
            if (data.GroupId is not null)
            {
                filterGroup = await _context.FilterGroups.FindAsync(data.GroupId);
                if (filterGroup is null)
                {
                    return Result.Fail<FilterOptionDto>("Filter group not found");
                }

                filterOption.FilterGroup = filterGroup;
                _context.FilterOptions.Add(filterOption);
            }


            await _context.SaveChangesAsync();
            var filterGroupDto = filterGroup is not null ? new FilterGroupDto(filterGroup.Id, filterGroup.Name) : null;

            return Result.Ok(new FilterOptionDto(filterOption.Id, filterOption.Name, filterGroupDto));
        }

        public async Task<Result> DeleteFilterGroupAsync(int id)
        {
            if (!await _context.FilterGroups.AnyAsync(fg => fg.Id == id))
            {
                return Result.Fail("Filter group not found");
            }

            _context.FilterGroups.Remove(new FilterGroup { Id = id });
            await _context.SaveChangesAsync();

            return Result.Ok();
        }

        public async Task<Result> DeleteFilterOptionAsync(int id)
        {
            if (!await _context.FilterOptions.AnyAsync(fo => fo.Id == id))
            {
                return Result.Fail("Filter option not found");
            }

            _context.FilterOptions.Remove(new FilterOption { Id = id });
            await _context.SaveChangesAsync();

            return Result.Ok();
        }

        public async Task<PaginatedDataDto<FilterGroupDto>> GetFilterGroupsAsync(int page = 1, int pageSize = 0)
        {
            var query = _context.FilterGroups.Select(fg => new FilterGroupDto(fg.Id, fg.Name));

            if (pageSize <= 0)
            {
                var allFilterGroups = await query.ToListAsync();
                return new PaginatedDataDto<FilterGroupDto>(allFilterGroups, 1, allFilterGroups.Count, allFilterGroups.Count, allFilterGroups.Count);
            }

            var count = await query.CountAsync();
            var filterGroups = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedDataDto<FilterGroupDto>(filterGroups, page, pageSize, (int)Math.Ceiling((double)count / pageSize), count);
        }

        public async Task<PaginatedDataDto<FilterOptionDto>> GetFilterOptionsAsync(int page, int pageSize)
        {
            var query = _context.FilterOptions.Select(fo =>
                new FilterOptionDto(fo.Id, fo.Name, fo.FilterGroup != null ? new FilterGroupDto(fo.FilterGroup.Id, fo.FilterGroup.Name) : null)
            );

            if (pageSize <= 0)
            {
                var allFilterOptions = await query.ToListAsync();
                return new PaginatedDataDto<FilterOptionDto>(allFilterOptions, 1, allFilterOptions.Count, allFilterOptions.Count, allFilterOptions.Count);
            }

            var count = await query.CountAsync();
            var filterOptions = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PaginatedDataDto<FilterOptionDto>(filterOptions, page, pageSize, (int)Math.Ceiling((double)count / pageSize), count);
        }
    }
}
