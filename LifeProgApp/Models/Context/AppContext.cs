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
        public DbSet<UserModel> users { get; set; }
        public DbSet<UserStatsModel> user_stats { get; set; }
        public DbSet<GoalModel> goals { get; set; }
        public DbSet<GoalCategoryModel> goal_categories { get; set; }
        public DbSet<DailyQuestModel> daily_quests { get; set; }
    }
}