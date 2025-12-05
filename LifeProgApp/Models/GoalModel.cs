using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeProgApp.Models
{
    [Table("goals")]
    public class GoalModel
    {
        [Key]
        [Column("goal_id")]
        public int GoalId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("category_id")]
        public int? CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Required]
        [Column("target_value")]
        public decimal TargetValue { get; set; }

        [Column("current_value")]
        public decimal CurrentValue { get; set; } = 0;

        [StringLength(20)]
        [Column("unit")]
        public string Unit { get; set; }

        [Required]
        [Column("target_date")]
        public DateTime TargetDate { get; set; }

        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [StringLength(20)]
        [Column("status")]
        public string Status { get; set; } = "active";

        [Column("priority")]
        public int Priority { get; set; } = 3;

        [Column("is_public")]
        public bool IsPublic { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [Column("completed_at")]
        public DateTime? CompletedAt { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual UserModel User { get; set; }

        [ForeignKey("CategoryId")]
        public virtual GoalCategoryModel Category { get; set; }

        // Calculated property
        [NotMapped]
        public int ProgressPercentage
        {
            get
            {
                if (TargetValue == 0) return 0;
                return (int)Math.Round((CurrentValue / TargetValue) * 100);
            }
        }

        [NotMapped]
        public int DaysRemaining
        {
            get
            {
                return (TargetDate - DateTime.Now).Days;
            }
        }
    }
}