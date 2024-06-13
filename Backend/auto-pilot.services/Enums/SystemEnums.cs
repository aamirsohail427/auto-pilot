using System;
using System.Collections.Generic;
using System.Text;

namespace auto.services.Enums
{
    public enum UserRole
    {
        Admin = 1,
        Agency = 2,
        User = 3,
    }
    public static class SessionNames
    {
        public static readonly string Token = "Token";
    }
}
