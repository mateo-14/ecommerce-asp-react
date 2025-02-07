using Ecommerce.Data;
using Ecommerce.Models;
using Ecommerce.Requests;
using Ecommerce.Services.CategoriesService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesService _categoriesService;
        private readonly AppDbContext _dbContext;
        public CategoriesController(ICategoriesService categoriesService, AppDbContext dbContext)
        {
            _categoriesService = categoriesService;
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateCategoryRequest body)
        {
            var result = await _categoriesService.CreateCategoryAsync(body);

            if (result.IsFailed)
            {

               return BadRequest(new ProblemDetails
               {
                   Title = "Bad Request",
                   Detail = result.Error.Message
               });
            }

            return Ok(result.Value);
        }

        [HttpGet]
        public async Task<IActionResult> Get(int page = 1, int pageSize = 0)
        {
            var categories = await _categoriesService.GetCategoriesAsync(page, pageSize);
            return Ok(categories);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _categoriesService.DeleteCategoryAsync(id);

            if (result.IsFailed)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Not Found",
                    Detail = result.Error.Message
                });
            }

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateCategoryRequest body)
        {
            var result = await _categoriesService.UpdateCategoryAsync(id, body);

            if (result.IsFailed)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Not Found",
                    Detail = result.Error.Message
                });
            }

            return Ok(result.Value);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _categoriesService.GetCategoryAsync(id);

            if (result.IsFailed)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Not Found",
                    Detail = result.Error.Message
                });
            }

            return Ok(result.Value);
        }
    }
}
