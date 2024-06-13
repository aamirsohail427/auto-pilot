
using AutoMapper;
using web_job.Models;
using web_job.Services.DTO;

namespace web_job.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<PolicyInfoDTO, Policy>().ReverseMap();
        }
    }
}
