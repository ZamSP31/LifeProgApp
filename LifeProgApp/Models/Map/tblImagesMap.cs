using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models.Map
{
    public class tblImagesMap : EntityTypeConfiguration<tblImagesModel>
    {
        public tblImagesMap()
        {
            HasKey(i => i.imageID);
            ToTable("tbl_images");
        }
    }
}