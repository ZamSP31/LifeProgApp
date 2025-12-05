using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class UserStatsModel
    {
        public int stat_id { get; set; }
        public int user_id { get; set; }
        public int total_quests_completed { get; set; }
        public int total_goals_achieved { get; set; }
        public int current_streak { get; set; }
        public int longest_streak { get; set; }
        public int weekly_quest_count { get; set; }
        public DateTime last_quest_date { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }
}