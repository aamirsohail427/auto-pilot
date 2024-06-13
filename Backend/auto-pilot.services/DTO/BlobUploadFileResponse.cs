using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.DTO
{
    public class BlobUploadFileResponse
    {
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        public string FileSize { get; set; }

    }
}
