using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class GoalModel
    {
        public int goalId { get; set; }
        public int userId { get; set; }
        public int categoryId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public decimal currentValue { get; set; }
        public decimal targetValue { get; set; }
        public string unit { get; set; }
        public DateTime startDate { get; set; }
        public DateTime targetDate { get; set; }
        public DateTime completedAt { get; set; }
        public string status { get; set; }
        public int priority { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}