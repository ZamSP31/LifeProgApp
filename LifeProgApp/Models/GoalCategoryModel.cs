using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LifeProgApp.Models
{
    public class GoalCategoryModel
    {

        [Key]
        public int category_id { get; set; }
        public int category_name { get; set; }
        public string description { get; set; }
        public string icon_name { get; set; }
        public string unit { get; set; }
        public DateTime created_at { get; set; }

    }
}