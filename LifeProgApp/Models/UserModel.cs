using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeProgApp.Models
{
    [Table("users")]
    public class UserModel
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [StringLength(255)]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [StringLength(255)]
        [Column("password_hash")]
        public string PasswordHash { get; set; }

        [Required]
        [StringLength(20)]
        [Column("first_name")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(15)]
        [Column("last_name")]
        public string LastName { get; set; }

        [StringLength(10)]
        [Column("gender")]
        public string Gender { get; set; }

        [StringLength(500)]
        [Column("profile_image_url")]
        public string ProfileImageUrl { get; set; }

        [Column("current_level")]
        public int CurrentLevel { get; set; } = 1;

        [Column("total_xp")]
        public int TotalXP { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [Column("last_login")]
        public DateTime? LastLogin { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("email_verified")]
        public bool EmailVerified { get; set; } = false;
    }
}