
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.Interfaces
{
    public interface ISessionManager
    {
        void SetToken(string token);
        string GetToken();
    }
}
