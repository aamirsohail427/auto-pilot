
using AutoMapper;
using auto.services.DTO.Input;
using auto.services.DTO.Output;
using auto_pilot.models.Models;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.DTO.Output;
using auto_pilot.services.DTO;

namespace auto.services.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Login, AuthInputDTO>().ReverseMap();
            CreateMap<Login, AuthOutputDTO>().ReverseMap();

            CreateMap<User, UserInputDTO>().ReverseMap();
            CreateMap<User, UserOutputDTO>().ReverseMap();

            CreateMap<AvailableMarket, MarketOutputDTO>().ReverseMap();
            CreateMap<AvailableMarket, MarketInputDTO>().ReverseMap();

            CreateMap<UserType, UserTypeInputDTO>().ReverseMap();
            CreateMap<UserType, UserTypeOutputDTO>().ReverseMap();

            CreateMap<BusinessLine, LookupInputDTO>().ReverseMap();
            CreateMap<BusinessLine, LookupOutputDTO>().ReverseMap();

            CreateMap<BusinessType, LookupInputDTO>().ReverseMap();
            CreateMap<BusinessType, LookupOutputDTO>().ReverseMap();

            CreateMap<AgencyCompany, LookupInputDTO>().ReverseMap();
            CreateMap<AgencyCompany, LookupOutputDTO>().ReverseMap();

            CreateMap<State, StateOutputDTO>().ReverseMap();
            CreateMap<State, StateInputDTO>().ReverseMap();

            CreateMap<EmailTemplate, EmailTemplateInputDTO>().ReverseMap();
            CreateMap<EmailTemplate, EmailTemplateOutputDTO>().ReverseMap();

            CreateMap<AppSetting, AppSettingDTO>().ReverseMap();

            CreateMap<RoleMenu, UserMenuDTO>().ReverseMap();
            CreateMap<Menu, MenuOutputDTO>().ReverseMap();

            CreateMap<User, MessageDTO>().ReverseMap();
            CreateMap<EmailTemplate, TemplateDTO>().ReverseMap();

            CreateMap<AppSetting, AppSettingDTO>().ReverseMap();
        }
    }
}
