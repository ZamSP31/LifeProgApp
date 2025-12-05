using System.Data.Entity;

namespace LifeProgApp.Models
{
    public class AppContext : DbContext
    {
        public AppContext() : base("db_app")
        {
            Database.SetInitializer<AppContext>(null);
        }

        // OLD TABLES (keep these)
        public DbSet<tblRegistrationModel> tbl_registration { get; set; }
        public DbSet<tblImagesModel> tbl_images { get; set; }

        // NEW TABLES (One % Database)
        public DbSet<UserModel> Users { get; set; }
        public DbSet<UserStatsModel> UserStats { get; set; }
        public DbSet<GoalModel> Goals { get; set; }
        public DbSet<GoalCategoryModel> GoalCategories { get; set; }
        public DbSet<DailyQuestModel> DailyQuests { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Configure table names directly (no Map classes needed)
            modelBuilder.Entity<tblRegistrationModel>().ToTable("tbl_registration");
            modelBuilder.Entity<tblImagesModel>().ToTable("tbl_images");
            modelBuilder.Entity<UserModel>().ToTable("users");
            modelBuilder.Entity<UserStatsModel>().ToTable("user_stats");
            modelBuilder.Entity<GoalModel>().ToTable("goals");
            modelBuilder.Entity<GoalCategoryModel>().ToTable("goal_categories");
            modelBuilder.Entity<DailyQuestModel>().ToTable("daily_quests");

            // Configure primary keys explicitly
            modelBuilder.Entity<tblRegistrationModel>().HasKey(t => t.registrationID);
            modelBuilder.Entity<tblImagesModel>().HasKey(t => t.imageID);
            modelBuilder.Entity<UserModel>().HasKey(t => t.UserId);
            modelBuilder.Entity<UserStatsModel>().HasKey(t => t.StatId);
            modelBuilder.Entity<GoalModel>().HasKey(t => t.GoalId);
            modelBuilder.Entity<GoalCategoryModel>().HasKey(t => t.CategoryId);
            modelBuilder.Entity<DailyQuestModel>().HasKey(t => t.QuestId);

            base.OnModelCreating(modelBuilder);
        }
    }
}