namespace Ecommerce.Services.ImageValidationService
{
    public class ImageValidationService : IImageValidationService
    {
        private readonly string[] _validMimeTypes =
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        public bool IsValidImage(IFormFile image)
        {
            return image != null && _validMimeTypes.Contains(image.ContentType);
        }
    }
}
