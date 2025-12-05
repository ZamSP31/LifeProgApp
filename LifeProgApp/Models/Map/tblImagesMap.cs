using System.Data.Entity.ModelConfiguration;

namespace LifeProgApp.Models
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