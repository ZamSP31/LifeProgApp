using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;


namespace LifeProgApp.Models.Map
{

    public class ArchiveStatusMap : EntityTypeConfiguration<ArchiveStatusModel>
    {
        public ArchiveStatusMap()
        {
            HasKey(a => a.status_id);
            ToTable("archive_status");
        }

    }
}