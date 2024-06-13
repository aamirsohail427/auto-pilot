using System;
using System.Collections.Generic;

#nullable disable

namespace auto_pilot.models.Models
{
    public partial class Menu
    {
        public Menu()
        {
            RoleMenus = new HashSet<RoleMenu>();
        }

        public int Id { get; set; }
        public string Text { get; set; }
        public string Icon { get; set; }
        public string Path { get; set; }
        public string LevelType { get; set; }
        public int? ParentId { get; set; }
        public int OrderNum { get; set; }

        public virtual ICollection<RoleMenu> RoleMenus { get; set; }
    }
}
