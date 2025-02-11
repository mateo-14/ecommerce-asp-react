namespace Ecommerce.Services.StorageService
{
    public interface IStorageService
    {
        /// <summary>
        /// Uploada file to storage and returns the random generated file key
        /// </summary>
        /// <param name="file"></param>
        /// <param name="fileName"></param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        Task<string> UploadFileAsync(Stream file, string fileName, string? contentType = null);
        Task DeleteFileAsync(string key);
        string GetFileUrl(string key);
    }
}
