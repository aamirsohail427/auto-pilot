﻿using auto_pilot.services.DTO.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace auto_pilot.services.DTO.Output
{
    public class UserTypeOutputDTO: UserTypeBaseDTO
    {
        public string ModifiedBy { set; get; }
    }
}
