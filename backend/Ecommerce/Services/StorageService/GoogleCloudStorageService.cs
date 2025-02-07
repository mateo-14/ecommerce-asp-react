
using Google.Cloud.Storage.V1;

namespace Ecommerce.Services.StorageService
{
    public class GoogleCloudStorageService : IStorageService
    {
        private readonly StorageClient _storage;
        public GoogleCloudStorageService(StorageClient storage)
        {
            _storage = storage;
        }

        public async Task<string> UploadFileAsync(Stream file, string fileName, string? contentType = null)
        {
            var extension = Path.GetExtension(fileName);
            var key = Guid.NewGuid().ToString() + extension;
            await _storage.UploadObjectAsync("ecommerce-59554.appspot.com", key, contentType, file);
            return key;
        }

        public async Task DeleteFileAsync(string key)
        {
            await _storage.DeleteObjectAsync("ecommerce-59554.appspot.com", key);
        }
    }
}
