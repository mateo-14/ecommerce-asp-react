using Ecommerce.Data;
using Ecommerce.DTOs;
using Ecommerce.Models;
using Ecommerce.Requests;
using Ecommerce.Services.ImageConverterService;
using Ecommerce.Services.StorageService;
using LightResults;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services.ProductService
{
    public class NotFoundCategoryError : Error
    {
        public NotFoundCategoryError() : base("Category not found")
        {
        }
    }

    public class NotFoundFiltersError : Error
    {
        public NotFoundFiltersError() : base("Some filters not found")
        {
        }
    }

    public class NotFoundProductError : Error
    {
        public NotFoundProductError() : base("Product not found")
        {
        }
    }

    public class ProductsService : IProductsService
    {
        private readonly AppDbContext _context;
        private readonly IImageConverterService _imageConverterService;
        private readonly IStorageService _storageService;

        public ProductsService(IImageConverterService imageConverterService, AppDbContext context, IStorageService storageService)
        {
            _imageConverterService = imageConverterService;
            _context = context;
            _storageService = storageService;
        }
        public async Task<Result<ProductDto>> CreateProductAsync(CreateProductRequest data)
        {
            var product = new Product()
            {
                Name = data.Name,
                Description = data.Description,
                Price = data.Price,
            };

            if (data.CategoryId is not null)
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == data.CategoryId);
                if (category is null)
                {
                    return Result.Fail<ProductDto>(new NotFoundCategoryError());
                }

                product.Category = category;
            }

            if (data.FiltersIds is not null)
            {
                var filters = await _context.FilterOptions.Where(f => data.FiltersIds.Contains(f.Id)).ToListAsync();
                if (filters.Count != data.FiltersIds.Count)
                {
                    return Result.Fail<ProductDto>(new NotFoundFiltersError());
                }

                product.Filters = filters;
            }

            if (data.Images is not null)
            {
                foreach (var image in data.Images)
                {
                    using var stream = image.OpenReadStream();
                    using var memoryStream = new MemoryStream();
                    // Convert image to webp
                    await _imageConverterService.ConvertImageToWebp(stream, memoryStream);
                    // Upload image to storage
                    memoryStream.Seek(0, SeekOrigin.Begin);
                    var origExtension = Path.GetExtension(image.FileName);

                    var key = await _storageService.UploadFileAsync(memoryStream, image.FileName.Replace(origExtension, ".webp"), "image/webp");
                    product.Images.Add(key);
                }

            }

            _context.Products.Add(product);
            try
            {
                await _context.SaveChangesAsync();
                return Result.Ok(
                    new ProductDto(product.Id, product.Name, product.Slug, product.Description, product.Price, product.Stock, product.Images, product.Category,
                        product.Filters.Select(f => new FilterOptionDto(f.Id, f.Name, f.FilterGroup != null ? new FilterGroupDto(f.FilterGroup.Id, f.FilterGroup.Name) : null)
                        ).ToList()
                    )
                );
            }
            catch (Exception)
            {
                // Rollback images
                if (product.Images.Count > 0)
                {
                    foreach (var image in product.Images)
                    {
                        await _storageService.DeleteFileAsync(image);
                    }
                }

                throw;
            }
        }

        public async Task<Result> DeleteProductAsync(int id)
        {
            var product = await _context.Products.Select(p => new Product()
            {
                Id = p.Id,
                Images = p.Images
            }).FirstOrDefaultAsync(p => p.Id == id);

            if (product is null)
            {
                return Result.Fail(new NotFoundProductError());
            }


            if (product.Images.Count > 0)
            {
                foreach (var image in product.Images.ToList())
                {
                    await _storageService.DeleteFileAsync(image);
                }
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Result.Ok();
        }

        public async Task<PaginatedDataDto<ProductDto>> GetProductsAsync(GetProductsRequest query)
        {
            var getProductsQuery = _context.Products.Select(p => p);

            if (!string.IsNullOrEmpty(query.Search))
            {
                getProductsQuery = getProductsQuery.Where(p =>
                    p.Name.Contains(query.Search) || (p.Description != null && p.Description.Contains(query.Search))
                );
            }

            if (query.Categories.Length > 0)
            {
                getProductsQuery = getProductsQuery.Where(p => p.Category != null && query.Categories.Contains(p.Category.Id));
            }

            if (query.Filters.Length > 0)
            {
                getProductsQuery = getProductsQuery.Where(p => p.Filters.Any(f => query.Filters.Contains(f.Id)));
            }

            if (query.Order == "asc")
            {
                if (query.OrderBy == "name")
                {
                    getProductsQuery = getProductsQuery.OrderBy(p => p.Name);
                }
                else if (query.OrderBy == "price")
                {
                    getProductsQuery = getProductsQuery.OrderBy(p => p.Price);
                }
            }
            else
            {
                if (query.OrderBy == "name")
                {
                    getProductsQuery = getProductsQuery.OrderByDescending(p => p.Name);
                }
                else if (query.OrderBy == "price")
                {
                    getProductsQuery = getProductsQuery.OrderByDescending(p => p.Price);
                }
            }

            var pageSize = query.PageSize <= 0 ? 10 : query.PageSize;
            var count = await _context.Products.CountAsync();
            var products = await getProductsQuery.Select(p =>
                new ProductDto(
                    p.Id, 
                    p.Name,
                    p.Slug, 
                    p.Description, 
                    p.Price, 
                    p.Stock,
                    p.Images.Select(i => _storageService.GetFileUrl(i)).ToList(), 
                    p.Category != null ? new Category
                        {
                            Id = p.Category.Id,
                            Name = p.Category.Name
                        } : null,
                    p.Filters.Select(f =>
                        new FilterOptionDto(f.Id, f.Name, f.FilterGroup != null ? new FilterGroupDto(f.FilterGroup.Id, f.FilterGroup.Name) : null)
                    ).ToList()
                )
            ).Skip((query.Page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedDataDto<ProductDto>(products, query.Page, pageSize, (int)Math.Ceiling((double)count / pageSize), count);
        }
    }
}
