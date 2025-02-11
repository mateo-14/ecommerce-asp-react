namespace Ecommerce.Services.StorageService
{
    public class LocalStorageService : IStorageService
    {
        private readonly string? _storagePath;
        private readonly string? _storageBaseUrl;

        public LocalStorageService(IConfiguration configuration)
        {
            _storagePath = configuration.GetValue<string>("Storage:Path");
            _storageBaseUrl = configuration.GetValue<string>("Storage:BaseURL");
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

        public string GetFileUrl(string key) 
        {
            if (_storageBaseUrl is null) 
            {
                throw new InvalidOperationException("Storage base url is not configured");
            }

            return $"{_storageBaseUrl}/{key}";
        }
    }
}
