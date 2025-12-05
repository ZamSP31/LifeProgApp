using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeProgApp.Models
{
    [Table("daily_quests")]
    public class DailyQuestModel
    {
        [Key]
        [Column("quest_id")]
        public int QuestId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [StringLength(50)]
        [Column("quest_type")]
        public string QuestType { get; set; } = "custom";

        [StringLength(20)]
        [Column("difficulty")]
        public string Difficulty { get; set; } = "medium";

        [Column("xp_reward")]
        public int XPReward { get; set; } = 10;

        [Column("quest_date")]
        public DateTime QuestDate { get; set; }

        [Column("is_completed")]
        public bool IsCompleted { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Navigation property
        [ForeignKey("UserId")]
        public virtual UserModel User { get; set; }
    }
}