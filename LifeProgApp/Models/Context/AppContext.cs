using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class AppContext : DbContext
    {
        public AppContext() : base("DefaultConnection")
        {
        }

        public DbSet<tblRegistrationModel> tbl_registration { get; set; }
        public DbSet<tblImagesModel> tbl_images { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<UserStatsModel> UserStats { get; set; }
        public DbSet<GoalModel> Goals { get; set; }
        public DbSet<GoalCategoryModel> GoalCategories { get; set; }
        public DbSet<DailyQuestModel> DailyQuests { get; set; }
    }
}