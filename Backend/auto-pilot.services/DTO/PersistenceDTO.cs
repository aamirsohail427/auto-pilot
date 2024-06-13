using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auto.services.DTO
{
    public class PersistenceFilterDTO
    {
        public long UserId { get; set; }
        public string PageName { get; set; }
        public string ScreenName { get; set; }
        public string PersistenceVersionNumber { get; set; }
    }

    public class PersistenceDTO : PersistenceFilterDTO
    {
        public List<PersistenceItemDTO> Items { get; set; }
    }

    public class PersistenceItemDTO
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
