using auto.services.Enums;
using auto_pilot.services.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.Services
{
    public class SessionManager : ISessionManager
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ISession _session;
        public SessionManager(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _session = _httpContextAccessor.HttpContext?.Session;
        }
        public string GetToken()
        {
            return _session.GetString(SessionNames.Token);
        }

        public void SetToken(string token)
        {
            _session.SetString(SessionNames.Token, token);
        }
    }
}
