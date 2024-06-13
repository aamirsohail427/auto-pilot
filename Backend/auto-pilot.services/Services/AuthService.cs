using AutoMapper;
using auto.services.DTO;
using auto.services.DTO.Input;
using auto.services.DTO.Output;
using auto.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using auto_pilot.models.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.Identity;
using auto.services.Utility;

namespace auto.services.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;
        public AuthService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<UserInfoDTO> GetById(long userId)
        {
            UserInfoDTO authOutput = new UserInfoDTO();
            authOutput = await (from US in _context.Users.Where(flt => flt.Id == userId)
                                join LG in _context.Logins on US.Id equals LG.UserId

                                select new UserInfoDTO()
                                {
                                    Id = US.Id,
                                    LoginId = LG.Id,
                                    FirstName = US.FirstName,
                                    LastName = !(US.LastName == null) ? US.LastName : "",
                                    RoleId = US.RoleId,
                                    Username = LG.Username,
                                    CreatedById = US.CreatedById,
                                    LogoText = US.CreatedBy.FirstName
                                }).FirstOrDefaultAsync();
            return _mapper.Map<UserInfoDTO>(authOutput);
        }

        public async Task<AuthOutputDTO> Authorization(string username)
        {
            AuthOutputDTO outputDTO = new AuthOutputDTO();
            var data = await _context.Logins.Where(x => x.Username.ToLower() == username.ToLower()).FirstOrDefaultAsync();
            outputDTO = _mapper.Map<AuthOutputDTO>(data);
            return outputDTO;
        }

        public async Task<bool> Update(long Id)
        {
            var entity = await _context.Logins.Where(ltd => ltd.Id == Id).FirstOrDefaultAsync();
            entity.LastLoginDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ValidationResultDTO> ValidatePassword(ChangePasswordDTO inputDTO)
        {
            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = false
            };
            var oldEntity = await _context.Logins.Where(x => x.UserId == inputDTO.Id).FirstOrDefaultAsync();
            if (!(oldEntity is null))
            {
                var verificationResult = new PasswordHasher().VerifyHashedPassword(oldEntity.Password, inputDTO.OldPassword);
                if (verificationResult == PasswordVerificationResult.Success)
                {
                    validationResultDTO.IsValid = true;
                }
            }
            return validationResultDTO;
        }

        public async Task<ValidationResultDTO> ChangePassword(ChangePasswordDTO inputDTO)
        {
            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = false
            };
            var oldEntity = await _context.Logins.FirstOrDefaultAsync(x => x.UserId == inputDTO.Id);
            if (!(oldEntity is null))
            {
                oldEntity.Password = new PasswordHasher().HashPassword(inputDTO.NewPassword);
                await _context.SaveChangesAsync();
                var verificationResult = new PasswordHasher().VerifyHashedPassword(oldEntity.Password, inputDTO.NewPassword);
                if (verificationResult == PasswordVerificationResult.Success)
                {
                    validationResultDTO.IsValid = true;
                }
            }

            return validationResultDTO;
        }

        public async Task<ValidationResultDTO> ValidateUsername(string email)
        {
            var validationResultDTO = new ValidationResultDTO
            {
                IsValid = false
            };
            var oldEntity = await _context.Logins.Where(x => x.Username == email).FirstOrDefaultAsync();
            if (!(oldEntity is null))
            {
                validationResultDTO.IsValid = true;
                validationResultDTO.Data = oldEntity;
            }
            return validationResultDTO;
        }

        public void UpdatePassword(long id, string password)
        {
            var user = _context.Logins.Where(x => x.Id == id).FirstOrDefault();
            user.Password = new PasswordHasher().HashPassword(password);
            _context.SaveChanges();
            return;
        }

        public string GetLogoUrl(long Id)
        {
            var entity = _context.AppSettings.Where(a => a.AgencyId == Id).Select(l => l.LogoUrl).FirstOrDefault();
            return entity;
        }
    }
}
