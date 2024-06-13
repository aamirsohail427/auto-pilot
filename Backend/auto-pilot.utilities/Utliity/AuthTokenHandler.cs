using auto.services.DTO;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static auto_pilot.utilities.Utliity.Enums;

namespace auto.utilities.Utliity
{
    public static class AuthTokenHandler
    {
        public static string GenerateAuthToken(UserInfoDTO dto, IConfiguration configuration)
        {
            var claims = new[]
            {
                new Claim("Id", Convert.ToString(dto.Id)),

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTConfigurations.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.Add(TimeSpan.FromDays(1)),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
