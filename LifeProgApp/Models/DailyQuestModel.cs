using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class DailyQuestModel
    {
        public int questId { get; set; }
        public int userId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string difficulty { get; set; }
        public int xpReward { get; set; }
        public DateTime questDate { get; set; }
        public bool isCompleted { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}