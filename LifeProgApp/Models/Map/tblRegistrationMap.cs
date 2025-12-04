using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class tblRegistrationMap : EntityTypeConfiguration<tblRegistrationModel>
    {
        public tblRegistrationMap() { 
            HasKey(i => i.registrationID);
            ToTable("tbl_registration");
        }
    }
}