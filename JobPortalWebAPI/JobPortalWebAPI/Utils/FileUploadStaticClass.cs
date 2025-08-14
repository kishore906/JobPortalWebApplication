namespace JobPortalWebAPI.Utils
{
    public static class FileUploadStaticClass
    {

        /* In ASP.NET Core, IFormFile is an interface from the Microsoft.AspNetCore.Http namespace.
         * 
                When a file is uploaded via an HTTP form (using multipart/form-data), ASP.NET Core automatically binds it to an object that implements IFormFile.

                Key points about IFormFile:
                Namespace: Microsoft.AspNetCore.Http
                Actual type at runtime: FormFile (internal implementation
                Represents: A single uploaded file from the client.

                Common properties:
                FileName – name of the file on the client.
                ContentType – MIME type of the file.
                Length – size in bytes.
                OpenReadStream() – to read the file’s contents.

                Common methods:
                CopyTo(Stream target)
                CopyToAsync(Stream target)
         */

        // Helper methods for file upload

        // Check file extension and Size
        public static (bool isValid, string errorMessage) ValidateFile(IFormFile file, string[] allowedExtensions, long maxSize)
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || !allowedExtensions.Contains(ext))
                return (false, $"Invalid file type. Allowed types: {string.Join(", ", allowedExtensions)}");

            if (file.Length > maxSize)
                return (false, $"File size exceeds limit of {maxSize / (1024 * 1024)} MB.");

            return (true, string.Empty);
        }

        // generate and return filepath of image or resume file
        public static async Task<string> SaveFileAsync(IFormFile file, string folderName)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", folderName);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fullPath = Path.Combine(folderPath, uniqueFileName);

            using (var fileStream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return Path.Combine("Uploads", folderName, uniqueFileName).Replace("\\", "/");
        }

        // Delete file from Uploads folder
        public static void DeleteFileIfExists(string? relativePath)
        {
            if (!string.IsNullOrEmpty(relativePath))
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), relativePath.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);
            }
        }
    }
}
