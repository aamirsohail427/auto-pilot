using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.utilities.Utliity
{
    public class Enums
    {
        public static class JWTConfigurations
        {
            public static readonly string SecretKey = "Let the Robotic Process Do the Work For You";
        }
        public enum UserRole
        {
            Admin = 1,
            Agency = 2,
            User = 3,
        }
        public static class AzureConfigurations
        {
            public static readonly string AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=thelivemd;AccountKey=8kJSgWOx8PBM/nVZ4tRbWDVUWrykxMEg7i61W+VLW5+fbWOlkzkLFtiTBYp8QPjB4HptHr1+XAYNYOhkdCNuBg==;EndpointSuffix=core.windows.net";
            public static readonly string AZURE_BLOB_CONTAINER = "mdlive";
            public static readonly string AZURE_BLOB_BASE_URL = "https://thelivemd.blob.core.windows.net/mdlive";
        }
    }
}
