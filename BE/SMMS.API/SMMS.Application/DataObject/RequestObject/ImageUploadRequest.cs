using Microsoft.AspNetCore.Http;

namespace SMMS.Application.DataObject.RequestObject
{
    public class ImageUploadRequest
    {
        public IFormFile Image { get; set; }
    }
} 