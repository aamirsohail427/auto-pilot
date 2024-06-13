using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Base
{
    public class MenuBaseDTO
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Icon { get; set; }
        public string Path { get; set; }
        public string LevelType { get; set; }
        public int? ParentId { get; set; }
        public int OrderNum { get; set; }
    }
}
