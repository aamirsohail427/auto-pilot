using auto.services.DTO;
using auto.services.DTO.Validation;
using auto_pilot.services.DTO;
using auto_pilot.services.DTO.Input;
using auto_pilot.services.DTO.Output;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace auto_pilot.services.Interfaces
{
    public interface INewBusinessService
    {
        public CustomerSummaryDetail GetPolicyInfo(int policyID);
        public PolicyListOutputDTO GetNewBusinessAsync(BusinessFilterDTO filterDTO);
        public PolicyListOutputDTO GetRenewalAsync(BusinessFilterDTO filterDTO);
        Task<object> InsertPolicy(InsertPolicyInputDTO model);
    }
}
