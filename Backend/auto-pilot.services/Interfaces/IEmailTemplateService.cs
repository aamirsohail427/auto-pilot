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
    public interface IEmailTemplateService
    {
        public TilesDTO GetTiles(long Id);
        public Task<List<EmailTemplateOutputDTO>> GetByFilter(string activeState,long Id);
        public Task<EmailTemplateOutputDTO> GetById(long Id);
        public Task<EmailTemplateOutputDTO> Create(EmailTemplateInputDTO inputDTO);
        public Task<EmailTemplateOutputDTO> Update(EmailTemplateInputDTO inputDTO);
        public Task<DeleteInputDTO> Delete(DeleteInputDTO deleteDTO);
        public ValidationResultDTO Check(CheckInputDTO checkInputDTO);
        public Task<ValidationResultDTO> Validate(ValidationDTO validationDTO);
        public ResultDTO Archive(ArchiveInputDTO inputDTO);
    }
}
