using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto.services.DTO
{
    public class ResultDTO
    {
        public bool IsValid { get; set; }
        public string MessageCode { get; set; }
        public object Data { get; set; }
    }
    public class ValidationResultDTO : ResultDTO
    {

    }
    public class ArchiveInputDTO
    {
        public List<long> Ids { get; set; }
        public bool IsArchived { get; set; }
    }

    public class CheckInputDTO
    {
        public long Id { get; set; }
    }

    public class DeleteInputDTO : CheckInputDTO
    {
    }
    public class DeleteResultDTO : ResultDTO
    {
        public List<Guid> DeleteIds { get; set; }
    }
}
