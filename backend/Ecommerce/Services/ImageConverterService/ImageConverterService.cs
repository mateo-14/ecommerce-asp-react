using SixLabors.ImageSharp;

namespace Ecommerce.Services.ImageConverterService
{
    public class ImageConverterService : IImageConverterService
    {
        public async Task ConvertImageToWebp(Stream stream, MemoryStream output)
        {
            using (var image = Image.Load(stream))
            {
                await image.SaveAsWebpAsync(output);
            }
        }
    }
}
