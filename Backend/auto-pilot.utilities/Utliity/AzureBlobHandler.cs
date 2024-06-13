using auto.services.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using static auto_pilot.utilities.Utliity.Enums;

namespace auto_pilot.utilities.Utliity
{
    public static class AzureBlobHandler
    {
        public async static Task<BlobUploadFileResponse> Upload(IFormFile file)
        {
            CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(AzureConfigurations.AZURE_STORAGE_CONNECTION_STRING);
            CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(AzureConfigurations.AZURE_BLOB_CONTAINER);
            await cloudBlobContainer.CreateIfNotExistsAsync();
            string fileName = GetUniqueFileName(file.FileName);
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
            await cloudBlockBlob.UploadFromStreamAsync(file.OpenReadStream());

            return new BlobUploadFileResponse
            {
                FileName = fileName,
                FilePath = fileName,
                FileType = file.ContentType,
                FileSize = file.Length.ToString()
            };
        }

        public async static Task<BlobUploadFileResponse> UploadBase64(string base64, string pathToUpload, string inputFileName)
        {
            CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(AzureConfigurations.AZURE_STORAGE_CONNECTION_STRING);
            CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(AzureConfigurations.AZURE_BLOB_CONTAINER);
            await cloudBlobContainer.CreateIfNotExistsAsync();
            string fileName = GetUniqueFileName(inputFileName);
            pathToUpload = pathToUpload + fileName;
            string strImage = base64.Replace("data:image/jpeg;base64,", "").Replace("data:image/png;base64,", "").Replace("data:image/gif;base64,", "").Replace("data:image/bmp;base64,", "");
            var bytes = Convert.FromBase64String(strImage);
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(pathToUpload);
            using (var stream = new MemoryStream(bytes))
            {
                await cloudBlockBlob.UploadFromStreamAsync(stream);
            }
            return new BlobUploadFileResponse
            {
                FileName = fileName,
                FilePath = pathToUpload,
                FileType = "jpg"
            };
        }

        public static string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName)
                      + "_"
                      + Guid.NewGuid().ToString().Substring(0, 6)
                      + Path.GetExtension(fileName);
        }
    }
}
