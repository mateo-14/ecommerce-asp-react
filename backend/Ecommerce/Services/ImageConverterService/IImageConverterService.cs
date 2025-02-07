namespace Ecommerce.Services.ImageConverterService
{
    public interface IImageConverterService
    {
        Task ConvertImageToWebp(Stream image, MemoryStream output);
    }
}
