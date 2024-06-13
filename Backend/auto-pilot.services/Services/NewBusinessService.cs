using aauto_pilot.services.Module;
using auto.services.DTO;
using auto_pilot.models.Models;
using auto_pilot.services.DTO;
using auto_pilot.services.DTO.Config;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.DTO.Output;
using auto_pilot.services.Interfaces;
using AutoMapper;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Services
{
    public class NewBusinessService : INewBusinessService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;
        private readonly ISessionManager _session;
        public NewBusinessService(IMapper mapper,
            ISessionManager session,
            AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
            _session = session;
        }


        #region Policy List

        public TokenOutputDTO GetTokenAsync(BusinessFilterDTO filterDTO)
        {
            AppSetting appSetting = new AppSetting();
            TokenOutputDTO outputTokenDTO = new TokenOutputDTO();
            outputTokenDTO.access_token = _session.GetToken();
            if (!(string.IsNullOrEmpty(outputTokenDTO.access_token)))
            {
                outputTokenDTO.access_token = _session.GetToken();
            }
            else
            {
                outputTokenDTO = GetTokenAsync(appSetting).Result;
                _session.SetToken(outputTokenDTO.access_token);
            }
            return outputTokenDTO;
        }

        public PolicyListOutputDTO GetNewBusinessAsync(BusinessFilterDTO filterDTO)
        {
            TokenOutputDTO outputTokenDTO = new TokenOutputDTO();
            outputTokenDTO = GetTokenAsync(filterDTO);
            var client = new RestClient("https://api.qqcatalyst.com/v1/Policies/LastModifiedCreated?startDate=2022-1-10&endDate=2022-1-27&pageSize=500");
            var request = new RestRequest(Method.GET);
            request.AddHeader("authorization", "Bearer " + $"{outputTokenDTO.access_token}");
            var response = client.Execute<BusinessOutputDTO>(request).Data;
            var outputDTO = new PolicyListOutputDTO();
            var result = new List<PolicyInfoDTO>();
            var customers = new List<CustomerSummaryDetail>();

            foreach (var item in response.Data.Where(x => x.PolicyNumber == "Pending" && x.Status == "P" && x.Term == "A" && x.IsDeleted == false))
            {
                PolicyInfoDTO policyInfoDTO = new PolicyInfoDTO();
                client = new RestClient("https://api.qqcatalyst.com/v1/Policies/" + item.PolicyId + "/PolicyInfo");
                request = new RestRequest(Method.GET);
                request.AddHeader("authorization", "Bearer " + $"{outputTokenDTO.access_token}");
                var policyInfo = client.Execute(request);
                var data = JsonConvert.DeserializeObject<List<PolicyInfoDTO>>(policyInfo.Content);
                data[0].Id = Guid.NewGuid();
                data[0].CustomerName = item.CustomerName;
                data[0].OpenSinceDays = (int)(DateTime.Now - item.CreatedOn).TotalDays;
                result.Add(data[0]);
            }
            outputDTO.Policies = result.Where(b => b.BusinessType == "N").OrderByDescending(o => o.OpenSinceDays).ToList();
            return outputDTO;
        }



        public PolicyListOutputDTO GetRenewalAsync(BusinessFilterDTO filterDTO)
        {
            TokenOutputDTO outputTokenDTO = new TokenOutputDTO();
            outputTokenDTO = GetTokenAsync(filterDTO);
            var client = new RestClient("https://api.qqcatalyst.com/v1/Policies/LastModifiedCreated?startDate=2022-01-01&endDate=2022-1-20&pageSize=500");
            var request = new RestRequest(Method.GET);
            request.AddHeader("authorization", "Bearer " + $"{outputTokenDTO.access_token}");
            var response = client.Execute<BusinessOutputDTO>(request).Data;
            var outputDTO = new PolicyListOutputDTO();
            var result = new List<PolicyInfoDTO>();
            var customers = new List<CustomerSummaryDetail>();
            foreach (var item in response.Data.Where(x => x.PolicyNumber != "Pending" && x.IsDeleted == false))
            {
                PolicyInfoDTO policyInfoDTO = new PolicyInfoDTO();
                client = new RestClient("https://api.qqcatalyst.com/v1/Policies/" + item.PolicyId + "/PolicyInfo");
                request = new RestRequest(Method.GET);
                request.AddHeader("authorization", "Bearer " + $"{outputTokenDTO.access_token}");
                var policyInfo = client.Execute(request);
                var data = JsonConvert.DeserializeObject<List<PolicyInfoDTO>>(policyInfo.Content);
                data[0].Id = Guid.NewGuid();
                data[0].CustomerName = item.CustomerName;
                data[0].RemainingDays = (int)(item.EffectiveDate - DateTime.Now).TotalDays;
                result.Add(data[0]);
            }
            outputDTO.Policies = result.OrderByDescending(o => o.RemainingDays).ToList();
            return outputDTO;
        }

        public CustomerSummaryDetail GetPolicyInfo(int policyID)
        {
            CustomerSummaryDetail summaryDetail = new CustomerSummaryDetail();
            TokenOutputDTO outputTokenDTO = new TokenOutputDTO();
            outputTokenDTO.access_token = _session.GetToken();
            var client = new RestClient("https://api.qqcatalyst.com/v1/Policies/" + policyID + "/PolicyInfo");
            var request = new RestRequest(Method.GET);
            request.AddHeader("authorization", "Bearer " + $"{outputTokenDTO.access_token}");
            var summary = client.Execute<CustomerSummaryDetail>(request).Data;
            summaryDetail.AgentID = summary.AgentID;
            summaryDetail.AgentName = summary.AgentName;
            summaryDetail.CSRID = summary.CSRID;
            summaryDetail.CSRName = summary.CSRName;

            return summaryDetail;
        }
        public async Task<object> InsertPolicy(InsertPolicyInputDTO model)
        {
            var entity = _context.AppSettings.Where(flt => flt.AgencyId == 30).FirstOrDefault();
            var token = await GetTokenAsync(entity);
            using HttpClient _client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Put, "/v1/Policies");
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token.access_token}");
            var reqMOdel = new InsertPolicyDTO()
            {
                Status = model.Status,
                EffectiveDate = model.EffectiveDate,
            };
            var content = JsonConvert.SerializeObject(reqMOdel);
            request.Content = new StringContent(content, Encoding.UTF8, "application/json");
            return await _client.ExecAsync<object>("https://api.qqcatalyst.com", request);
        }


        #endregion
        #region privateMethod
        private async Task<TokenOutputDTO> GetTokenAsync(AppSetting appSetting)
        {
            var authInfo = new Dictionary<string, string>
            //{
            //    { "grant_type", "password" },
            //    { "username", appSetting.UserName },
            //    { "password", appSetting.Password },
            //    { "client_id", appSetting.ClientId },
            //    { "client_secret", appSetting.ClientSecret }
            //};
            {
                { "grant_type", "password" },
                { "username", "pl@ipexins.com" },
                { "password", "Xman@2020*" },
                { "client_id", "740c32e2-5501-4bbc-81a4-e3afd2e41975" },
                { "client_secret", "8f60a508-288c-4aa2-9393-214a166da139" }
            };
            using HttpClient _client = new HttpClient();
            return await _client.PostAsync<TokenOutputDTO>("https://login.qqcatalyst.com/oauth/token", authInfo);

        }
        #endregion
    }
}
