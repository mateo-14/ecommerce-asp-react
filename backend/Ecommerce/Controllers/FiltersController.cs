using Ecommerce.Requests;
using Ecommerce.Services.FiltersService;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FiltersController : ControllerBase
    {
        private readonly IFiltersService _filtersService;
        public FiltersController(IFiltersService filtersService)
        {
            _filtersService = filtersService;
        }

        [HttpPost("groups")]
        public async Task<IActionResult> PostGroup([FromBody] CreateFilterGroupRequest body)
        {
            var filterGroup = await _filtersService.CreateFilterGroupAsync(body);
            return Ok(filterGroup);
        }

        [HttpGet("groups")]
        public async Task<IActionResult> GetGroups(int page = 1, int pageSize = 0)
        {
            var filterGroups = await _filtersService.GetFilterGroupsAsync(page, pageSize);
            return Ok(filterGroups);
        }

        [HttpDelete("groups/{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var result = await _filtersService.DeleteFilterGroupAsync(id);

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

        [HttpPost("options")]
        public async Task<IActionResult> PostOption([FromBody] CreateFilterOptionRequest body)
        {
            var result = await _filtersService.CreateFilterOptionAsync(body);

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

        [HttpGet("options")]
        public async Task<IActionResult> GetOptions(int page = 1, int pageSize = 0)
        {
            var filterOptions = await _filtersService.GetFilterOptionsAsync(page, pageSize);
            return Ok(filterOptions);
        }

        [HttpDelete("options/{id}")]
        public async Task<IActionResult> DeleteOption(int id)
        {
            var result = await _filtersService.DeleteFilterOptionAsync(id);

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
    }
}
