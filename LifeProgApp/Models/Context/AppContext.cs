using LifeProgApp.Models.Map;
using MySql.Data.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{

    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class AppContext : DbContext

    {
        static AppContext()
        {
            Database.SetInitializer<AppContext>(null);
        }

        public AppContext() : base("Name=db_app"){ }

        public virtual DbSet<tblRegistrationModel> tbl_registration { get; set; }
        public virtual DbSet<tblImagesModel> tbl_images { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new tblRegistrationMap());
            modelBuilder.Configurations.Add(new tblImagesMap());
        }



    }
}