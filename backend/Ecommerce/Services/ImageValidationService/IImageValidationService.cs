namespace Ecommerce.Services.ImageValidationService
{
    public interface IImageValidationService
    {
        bool IsValidImage(IFormFile image);
    }
}
