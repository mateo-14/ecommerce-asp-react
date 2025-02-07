using Ecommerce.Data;
using Ecommerce.DTOs;
using Ecommerce.Models;
using Ecommerce.Requests;
using LightResults;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services.CategoriesService
{
    public class CategoriesService : ICategoriesService
    {
        private readonly AppDbContext _context;

        public CategoriesService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Result<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest data)
        {
            if (data.ParentId != null)
            {
                var exists = await _context.Categories.AnyAsync(c => c.Id == data.ParentId);
                if (!exists)
                {
                    return Result.Fail<CategoryDto>("Parent category not found");
                }
            }

            var category = new Category()
            {
                Name = data.Name,
                ParentId = data.ParentId
            };

            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return Result.Ok(new CategoryDto(category.Id, category.Name, category.ParentId));
        }

        public async Task<Result> DeleteCategoryAsync(int id)
        {
            if (!await _context.Categories.AnyAsync(c => c.Id == id))
            {
                return Result.Fail("Category not found");
            }

            _context.Categories.Remove(new Category() { Id = id });
            await _context.SaveChangesAsync();
            return Result.Ok();
        }

        public async Task<PaginatedDataDto<CategoryDto>> GetCategoriesAsync(int page = 1, int pageSize = 0)
        {
            var query = _context.Categories.OrderBy(c => c.CreatedAt).Select(c =>
                new CategoryDto(c.Id, c.Name, c.Parent != null ? c.Parent.Id : null, c.Parent != null ? c.Parent.Name : null)
            );


            if (pageSize <= 0)
            {
                var allCategories = await query.ToListAsync();
                return new PaginatedDataDto<CategoryDto>(allCategories, 1, allCategories.Count, allCategories.Count, allCategories.Count);
            }

            var total = await query.CountAsync();
            var categories = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedDataDto<CategoryDto>(categories, page, pageSize, (int)Math.Ceiling((double)total / pageSize), total);
        }

        public async Task<Result<CategoryDto>> GetCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return Result.Fail<CategoryDto>("Category not found");
            }

            return Result.Ok(new CategoryDto(category.Id, category.Name, category.ParentId));
        }

        public async Task<Result<CategoryDto>> UpdateCategoryAsync(int id, UpdateCategoryRequest data)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return Result.Fail<CategoryDto>("Category not found");
            }

            if (data.ParentId != null)
            {
                var exists = await _context.Categories.AnyAsync(c => c.Id == data.ParentId);
                if (!exists)
                {
                    return Result.Fail<CategoryDto>("Parent category not found");
                }
            }

            category.Name = data.Name;
            category.ParentId = data.ParentId;

            await _context.SaveChangesAsync();

            return Result.Ok(new CategoryDto(category.Id, category.Name, category.ParentId));
        }
    }
}
