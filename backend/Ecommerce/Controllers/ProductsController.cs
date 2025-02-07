using Ecommerce.Requests;
using Ecommerce.Services.ImageValidationService;
using Ecommerce.Services.ProductService;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IImageValidationService _imageValidationService;
        private readonly IProductsService _productService;
        public ProductsController(IImageValidationService imageValidationService, IProductsService productService)
        {
            _imageValidationService = imageValidationService;
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] GetProductsRequest query)
        {
            var products = await _productService.GetProductsAsync(query);
            return Ok(products);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CreateProductRequest body)
        {
            var areAllImagesValid = true;

            if (body.Images is not null)
            {
                foreach (var image in body.Images)
                {
                    if (!_imageValidationService.IsValidImage(image))
                    {
                        areAllImagesValid = false;
                        break;
                    }
                }
            }

            if (!areAllImagesValid)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Bad Request",
                    Detail = "Some images are not valid",
                    Type = "invalid-images"
                });
            }


            var result = await _productService.CreateProductAsync(body);

            if (result.IsFailed)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Bad Request",
                    Detail = result.Error.Message,
                    Type = result.HasError<NotFoundCategoryError>() ? "invalid-category" : result.HasError<NotFoundFiltersError>() ? "invalid-filters" : "unknown"
                });
            }


            return Ok(result.Value);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productService.DeleteProductAsync(id);

            if (result.IsFailed)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Not Found",
                    Detail = result.Error.Message
                });
            }

            return NoContent();
        }
    }
}
