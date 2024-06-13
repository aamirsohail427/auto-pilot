using AutoMapper;
using Newtonsoft.Json;
using RestSharp;
using web_job.Models;
using web_job.Services.DTO;
using web_job.Services.Methods;

namespace web_job.Services.Business
{
    public class BusinessService: IBusinessService
    {
        private readonly IMapper _mapper;
        private readonly AutoPilotContext _context;
        public BusinessService(IMapper mapper, AutoPilotContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public void GetBusiness()
        {
            TokenOutputDTO outputTokenDTO = new TokenOutputDTO();
            //var token = GetTokenAsync();
            outputTokenDTO.access_token = "gAAAAASDw4SoGIZ4pilNxGRcrAECRVAu1d_XOKCEPxDglVetw88WKQwVmRq1-xUWMJWzW5PqpCN-ZAUjojI_TSJ_ayTYVw363zf1qjGeNLT7fEJuZ22gYltDvz_4N-T64ody13O10mgLRH0Tv71zL1nYQ7tZBfXOpVjznRrpPGqOacRURAMAAIAAAAAUW6UZEW4q9pO6j7RCMwxCRQy5nWK4Wjf7LCEldOQgNQ5WrXLsLXf8MVuWdjGQRs86siaWlaRaoCGkBWtbnxKhQfPxzZCucyZx54kEAajU2-UmBpn85qB1azFWoLfDGrYq7olQzzgt-k6gyxgDUc16Vt0OWxizO2AGFJ8lJdmUi7NAJgtx11SE5HccGS6dDwDYBwcNNfFUQJz0C33g05MRh7n5LH99CchZBxuAYO6THWk6xTvoy89tBUp7bZ4unU_vM8CTdzOa0ibc5zy5XbYBJKXt79HsX8vthgIM2AwNz3DIBNKFG_yuz-CQPtxSwEnzjcx0baS33XS14rpai6g51GkjtgcHC2H9_-NzpF7sBKT7We0xnfRrNVgQdpPwdj_l1SzqsTkJJMR6UGFNmo5jZMOvK_w5d_SDPGLK__FS23_voh75jV4RIa4uXQ7zQF_meW29CBa98bgMh434-F9kKyfeiuZQnLHk13aDtUh6SeVpxmBwsTYqDrAR-16wOyZXQzsRDz4eb_jilpQqRLrNQaBCKvU6UfR6id1LgfmdbZPTs5PyqypIRb35LGsCtOM4nGo_qhVAVTO0Dc4Uz-aQOofXdFnf7t2fntS-jRuN8qlS17Zc1FGdd5cs147B9FAOfIOEVmBhMb_UDpimgVYszSkJ88UDAUMu_YcbfiD8VWZj3Li0h-sxJQu0eaUwtcwczMBlWlopxFuD6x4oXbQuWVkXv_CyxWYeB-8P-svSnMdkqXAlnCu0jZNDjH1wnVa2ANFNwjI1Q6Ke3fkMDYjcPOMkostvrL3RYwsbF8lwacDCTP5N55TWYWzv8xwlKHke1JaHwQYA6Ee6MxkPZ7Smdoflv5MiPcYtmmBc-sgge9dcabUaoBQ5On0mGvShEEG6_DkdEQhg8hldI1znn92G3WaT_vJ_Q0GyZbXok1DdRQ_tygNGo-MnMv6fWYaJ2zHLwQC--SapFGhnI7ouqsrlV7HgbqLKByASjBMy_6KnMxcnvd05B4UIJkdF_iFwnKgGl8MbmbhzkfzqjXmmxwxSRRQD60j2qSKktD10HwEZYpOx4FIihx8BQ7kp3s2szPtTSBkeShKFsX0GuWVUAJIa";
            var client = new RestClient("https://api.qqcatalyst.com/v1/Policies/LastModifiedCreated?startDate=2022-01-01&endDate=2022-1-20&pageSize=500");
            var request = new RestRequest(Method.GET);
            request.AddHeader("authorization", "Bearer " + $"{outputTokenDTO.access_token}");
            var response = client.Execute<BusinessOutputDTO>(request).Data;
            var result = new List<PolicyInfoDTO>();

            foreach (var item in response.Data.Where(x => x.PolicyNumber == "Pending" && x.IsDeleted == false))
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
            var policies = _mapper.Map<List<PolicyInfoDTO>, List<Policy>>(result);
            _context.Policies.AddRange(policies);
            _context.SaveChanges();
        }

        private async Task<TokenOutputDTO> GetTokenAsync()
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
    }
}
