using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class UserStatsModel
    {
        public int statId { get; set; }
        public int userId { get; set; }
        public int totalQuestsCompleted { get; set; }
        public int totalGoalsAchieved { get; set; }
        public int currentStreak { get; set; }
        public int longestStreak { get; set; }
        public int weeklyQuestCount { get; set; }
        public DateTime lastQuestDate { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}