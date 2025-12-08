using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeProgApp.Models
{
    [Table("goals")]
    public class GoalModel
    {

        [Key]
        public int goal_id { get; set; }
        public int user_id { get; set; }
        public int category_id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public decimal current_value { get; set; }
        public decimal target_value { get; set; }
        public string unit { get; set; }
        public DateTime start_date { get; set; }
        public DateTime target_date { get; set; }
        public DateTime completed_at { get; set; }
        public string status { get; set; }
        public int priority { get; set; }
        public int is_public { get; set; } 
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}