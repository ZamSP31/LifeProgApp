using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class DailyQuestModel
    {

        [Key]
        public int quest_id { get; set; }
        public int user_id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string difficulty { get; set; }
        public int xp_reward { get; set; }
        public DateTime quest_date { get; set; }
        public bool is_completed { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}