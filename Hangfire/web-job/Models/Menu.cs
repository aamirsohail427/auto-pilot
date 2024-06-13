using System;
using System.Collections.Generic;

namespace web_job.Models
{
    public partial class Menu
    {
        public Menu()
        {
            RoleMenus = new HashSet<RoleMenu>();
        }

        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public string? Icon { get; set; }
        public string? Path { get; set; }
        public string LevelType { get; set; } = null!;
        public int? ParentId { get; set; }
        public int OrderNum { get; set; }

        public virtual ICollection<RoleMenu> RoleMenus { get; set; }
    }
}
