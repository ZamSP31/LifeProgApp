using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeProgApp.Models
{
    [Table("user_stats")]
    public class UserStatsModel
    {
        [Key]
        [Column("stat_id")]
        public int StatId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("total_quests_completed")]
        public int TotalQuestsCompleted { get; set; } = 0;

        [Column("total_goals_achieved")]
        public int TotalGoalsAchieved { get; set; } = 0;

        [Column("current_streak")]
        public int CurrentStreak { get; set; } = 0;

        [Column("longest_streak")]
        public int LongestStreak { get; set; } = 0;

        [Column("last_quest_date")]
        public DateTime? LastQuestDate { get; set; }

        [Column("weekly_quest_count")]
        public int WeeklyQuestCount { get; set; } = 0;

        [Column("week_start_date")]
        public DateTime? WeekStartDate { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Navigation property
        [ForeignKey("UserId")]
        public virtual UserModel User { get; set; }
    }
}