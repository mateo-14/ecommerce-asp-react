namespace Ecommerce.Services.StorageService
{
    public class LocalStorageService : IStorageService
    {
        private readonly string? _storagePath;
        public LocalStorageService(IConfiguration configuration)
        {
            _storagePath = configuration.GetValue<string>("Storage:Path");
        }
        public async Task<string> UploadFileAsync(Stream image, string fileName, string? contentType = null)
        {
            if (_storagePath is null)
            {
                throw new InvalidOperationException("Storage path is not configured");
            }

            CreateDirectoryIfNotExists(_storagePath);

            var extension = Path.GetExtension(fileName);
            var uuid = Guid.NewGuid().ToString();
            var randomFileName = $"{uuid}{extension}";
            var filePath = Path.Combine(_storagePath, randomFileName);
            using var fileStream = File.Create(filePath);
            await image.CopyToAsync(fileStream);
            return randomFileName;
        }

        public Task DeleteFileAsync(string key)
        {
            if (_storagePath is null)
            {
                throw new InvalidOperationException("Storage path is not configured");
            }

            var filePath = Path.Combine(_storagePath, key);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            return Task.CompletedTask;
        }

        private void CreateDirectoryIfNotExists(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }
    }
}
